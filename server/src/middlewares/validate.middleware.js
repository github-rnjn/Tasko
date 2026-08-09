const ApiError = require("../utils/ApiError");
const {HTTP_STATUS} = require("../constants/index");

const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(
                new ApiError(
                    HTTP_STATUS.BAD_REQUEST,
                    "Validation failed",
                    result.error.issues
                )
            );
        }

        req.body = result.data;

        next();
    };
};

module.exports = validate;