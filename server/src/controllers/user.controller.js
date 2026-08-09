const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200).json(

        new ApiResponse(
            200,
            "Current user fetched successfully",
            req.user
        )

    );

});

module.exports = {
    getCurrentUser
};