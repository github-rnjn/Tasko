const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const { HTTP_STATUS } = require("../constants");

const profileService = require("../services/profile.service");

const validate =
    require("../utils/validate");

const {updateProfileSchema,changePasswordSchema} = require("../validators/profile.validator");

const getProfile = asyncHandler(async (req, res) => {

    const profile =
        await profileService.getProfile(
            req.user._id
        );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(

            HTTP_STATUS.OK,

            "Profile fetched successfully",

            profile

        )

    );

});

const updateProfile = asyncHandler(async (req, res) => {

    const data = validate(
        updateProfileSchema,
        req.body
    );

    const profile =
        await profileService.updateProfile(
            req.user._id,
            data
        );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(
            HTTP_STATUS.OK,
            "Profile updated successfully",
            profile
        )

    );

});

const changePassword = asyncHandler(async (req, res) => {

    const data = validate(
        changePasswordSchema,
        req.body
    );

    await profileService.changePassword(
        req.user._id,
        data
    );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(

            HTTP_STATUS.OK,

            "Password changed successfully. Please login again."

        )

    );

});

const updateAvatar = asyncHandler(async (req, res) => {

    if (!req.file) {

        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Avatar is required"
        );

    }

    const profile =
        await profileService.updateAvatar(
            req.user._id,
            req.file
        );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(

            HTTP_STATUS.OK,

            "Avatar updated successfully",

            profile

        )

    );

});

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    updateAvatar
};