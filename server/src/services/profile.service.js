const ApiError = require("../utils/ApiError");

const { HTTP_STATUS } = require("../constants");

const profileRepository = require("../repositories/profile.repository");

const authRepository = require("../repositories/auth.repository");

const bcryptjs = require("bcryptjs");

const sessionRepository = require("../repositories/session.repository");

const cloudinary = require("../config/cloudinary");

const {
    extractPublicId,
} = require("../utils/cloudinary");

class ProfileService {

    async getProfile(userId) {

        const user =
            await profileRepository.findById(userId);

        if (!user) {

            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "User not found"
            );

        }

        return user;

    }

    async updateProfile(userId, data) {

        const user =
            await profileRepository.findById(userId);

        if (!user) {

            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "User not found"
            );

        }

        return profileRepository.updateById(
            userId,
            {
                name: data.name.trim(),
            }
        );

    }

    async changePassword(userId, data) {

        const user =
            await authRepository.findByIdWithPassword(userId);

        if (!user) {

            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "User not found"
            );

        }

        const isMatch =
            await bcryptjs.compare(
                data.currentPassword,
                user.password
            );

        if (!isMatch) {

            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Current password is incorrect"
            );

        }

        if (
            data.currentPassword ===
            data.newPassword
        ) {

            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "New password must be different"
            );

        }

        const hashedPassword =
            await bcryptjs.hash(
                data.newPassword,
                10
            );

        await profileRepository.updatePassword(
            userId,
            hashedPassword
        );

        await sessionRepository.deleteAllByUser(
            userId
        );

    }

    async updateAvatar(userId, file) {

        const user =
            await profileRepository.findById(userId);

        if (!user) {

            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "User not found"
            );

        }

        const oldAvatar = user.avatar;

        const updatedUser =
            await profileRepository.updateAvatar(
                userId,
                file.path
            );

        if (oldAvatar) {

            const publicId =
                extractPublicId(oldAvatar);

            if (publicId) {

                await cloudinary.uploader.destroy(
                    publicId
                );

            }

        }

        return updatedUser;

    }
}

module.exports = new ProfileService();