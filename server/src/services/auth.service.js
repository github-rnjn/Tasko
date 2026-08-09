const ApiError = require("../utils/ApiError");

const authRepository = require("../repositories/auth.repository");
const sessionRepository = require("../repositories/session.repository");
const verificationTokenRepository = require("../repositories/verificationToken.repository");

const emailService = require("./email.service");

const { HTTP_STATUS } = require("../constants");
const TOKEN_TYPES = require("../constants/tokenTypes");

const { generateNumericOTP, hashToken } = require("../utils/token");
const {generateAccessToken,generateRefreshToken,verifyRefreshToken,verifyAccessToken} = require("../utils/jwt");

class AuthService {
    async register(data) {
        const existingUser = await authRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ApiError(
                HTTP_STATUS.CONFLICT,
                "Email already registered"
            );
        }

        const user = await authRepository.create(data);

        await verificationTokenRepository.deleteByUser(
            user._id,
            TOKEN_TYPES.EMAIL_VERIFICATION
        );

        const otp = generateNumericOTP();

        await verificationTokenRepository.create({
            user: user._id,
            tokenHash: hashToken(otp),
            type: TOKEN_TYPES.EMAIL_VERIFICATION,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        await emailService.sendVerificationEmail(user, otp);

        return user;
    }

    async login(data, deviceInfo) {

        const user = await authRepository.findByEmailWithPassword(data.email);

        if (!user) {
            throw new ApiError(
                HTTP_STATUS.UNAUTHORIZED,
                "Invalid email or password"
            );
        }

        if (!user.isVerified) {
            throw new ApiError(
                HTTP_STATUS.FORBIDDEN,
                "Please verify your email first."
            );
        }

        const isPasswordCorrect = await user.comparePassword(data.password);

        if (!isPasswordCorrect) {
            throw new ApiError(
                HTTP_STATUS.UNAUTHORIZED,
                "Invalid email or password"
            );
        }

        const payload = {
            id: user._id,
            email: user.email
        };

        const accessToken = generateAccessToken(payload);

        const refreshToken = generateRefreshToken(payload);

        await sessionRepository.create({

            user: user._id,

            refreshToken: hashToken(refreshToken),

            deviceName: deviceInfo.deviceName,

            userAgent: deviceInfo.userAgent,

            ipAddress: deviceInfo.ipAddress,

            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        });

        await authRepository.updateLastLogin(user._id);

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    async verifyEmail(email, otp) {
        const user = await authRepository.findByEmail(email);

        if (!user) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "User not found"
            );
        }

        if (user.isVerified) {
            throw new ApiError(
                HTTP_STATUS.CONFLICT,
                "Email already verified"
            );
        }

        const verificationToken =
            await verificationTokenRepository.findByUser(
                user._id,
                TOKEN_TYPES.EMAIL_VERIFICATION
            );

        if (!verificationToken) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Verification code expired. Please request a new one."
            );
        }

        const hashedOTP = hashToken(otp);

        if (hashedOTP !== verificationToken.tokenHash) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Invalid verification code"
            );
        }

        const verifiedUser = await authRepository.verifyUser(user._id);

        await verificationTokenRepository.deleteByUser(
            user._id,
            TOKEN_TYPES.EMAIL_VERIFICATION
        );

        return verifiedUser;
    }

    async resendVerification(email) {

        const user = await authRepository.findByEmail(email);

        if (!user) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "User not found"
            );
        }

        if (user.isVerified) {
            throw new ApiError(
                HTTP_STATUS.CONFLICT,
                "Email already verified"
            );
        }

        const existingToken =
            await verificationTokenRepository.findByUser(
                user._id,
                TOKEN_TYPES.EMAIL_VERIFICATION
            );

        if (
            existingToken &&
            Date.now() - existingToken.createdAt.getTime() < 30 * 1000
        ) {
            throw new ApiError(
                HTTP_STATUS.TOO_MANY_REQUESTS,
                "Please wait 30 seconds before requesting another verification code."
            );
        }

        await verificationTokenRepository.deleteByUser(
            user._id,
            TOKEN_TYPES.EMAIL_VERIFICATION
        );

        const otp = generateNumericOTP();

        await verificationTokenRepository.create({
            user: user._id,
            tokenHash: hashToken(otp),
            type: TOKEN_TYPES.EMAIL_VERIFICATION,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        await emailService.sendVerificationEmail(user, otp);
    }

    async refreshToken(refreshToken) {

        if (!refreshToken) {
            throw new ApiError(
                HTTP_STATUS.UNAUTHORIZED,
                "Refresh token missing"
            );
        }

        let payload;

        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            throw new ApiError(
                HTTP_STATUS.UNAUTHORIZED,
                "Invalid refresh token"
            );
        }

        const tokenHash = hashToken(refreshToken);

        const session =
            await sessionRepository.findByRefreshTokenHash(
                tokenHash
            );
        
        const user = await authRepository.findById(payload.id);

        if (!user) {
            throw new ApiError(
                HTTP_STATUS.UNAUTHORIZED,
                "User not found"
            );
        }

        if (!session) {
            throw new ApiError(
                HTTP_STATUS.UNAUTHORIZED,
                "Session expired"
            );
        }

        if (session.user.toString() !== payload.id) {
            throw new ApiError(
                HTTP_STATUS.UNAUTHORIZED,
                "Invalid session"
            );
        }

        const newPayload = {
            id: payload.id,
            email: payload.email
        };

        const newAccessToken =
            generateAccessToken(newPayload);

        const newRefreshToken =
            generateRefreshToken(newPayload);

        await sessionRepository.updateRefreshToken(

            session._id,

            hashToken(newRefreshToken),

            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        );

        return {
            user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }

    async logout(userId,refreshToken) {

        if (!refreshToken) {
            return;
        }

        const tokenHash = hashToken(refreshToken);

        await sessionRepository.deleteByUserAndRefreshTokenHash(
            userId,
            tokenHash
        );

        return;
    }

    async forgotPassword(email) {

        const user = await authRepository.findByEmail(email);

        if (!user) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "User not found"
            );
        }

        if (!user.isVerified) {
            throw new ApiError(
                HTTP_STATUS.FORBIDDEN,
                "Please verify your email first."
            );
        }

        await verificationTokenRepository.deleteByUser(
            user._id,
            TOKEN_TYPES.PASSWORD_RESET
        );

        const otp = generateNumericOTP();

        await verificationTokenRepository.create({

            user: user._id,

            tokenHash: hashToken(otp),

            type: TOKEN_TYPES.PASSWORD_RESET,

            expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
            )

        });

        await emailService.sendPasswordResetEmail(
            user,
            otp
        );

    }

    async resetPassword(email, otp, password) {

        const user = await authRepository.findByEmail(email);

        if (!user) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "User not found"
            );
        }

        const verificationToken =
            await verificationTokenRepository.findByUser(
                user._id,
                TOKEN_TYPES.PASSWORD_RESET
            );

        if (!verificationToken) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Reset code expired"
            );
        }

        const hashedOTP = hashToken(otp);

        if (hashedOTP !== verificationToken.tokenHash) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Invalid reset code"
            );
        }

        await authRepository.updatePassword(
            user._id,
            password
        );

        await verificationTokenRepository.deleteByUser(
            user._id,
            TOKEN_TYPES.PASSWORD_RESET
        );

        await sessionRepository.deleteAllByUser(
            user._id
        );

        return;
    }
}

module.exports = new AuthService();