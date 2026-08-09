const {HTTP_STATUS} = require("../constants/index");

module.exports = (req, res) => {

    res.status(HTTP_STATUS.NOT_FOUND).json({

        success: false,

        message: "Route Not Found"

    });

};