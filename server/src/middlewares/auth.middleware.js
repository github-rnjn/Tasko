const ApiError = require("../utils/ApiError");

const { HTTP_STATUS } = require("../constants");

const authRepository = require("../repositories/auth.repository");

const { verifyAccessToken } = require("../utils/jwt");

const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Authentication required"
        );
    }

    const token = authHeader.split(" ")[1];

    let payload;

    try {
        payload = verifyAccessToken(token);
    } catch {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Invalid or expired access token"
        );
    }

    const user = await authRepository.findById(payload.id);

    if (!user) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "User not found"
        );
    }

    req.user = user;

    next();

});

module.exports = authMiddleware;