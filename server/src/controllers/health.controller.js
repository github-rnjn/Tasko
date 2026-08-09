const ApiResponse = require("../utils/ApiResponse");
const {HTTP_STATUS} = require("../constants/index");

const healthCheck = (req, res) => {
    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
            HTTP_STATUS.OK,
            "Server is running"
        )
    );
};

module.exports = {
    healthCheck
};