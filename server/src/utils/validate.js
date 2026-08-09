const ApiError = require("./ApiError");

const { HTTP_STATUS } = require("../constants");

function validate(schema, data) {

    const result = schema.safeParse(data);

    if (!result.success) {

        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            result.error.issues[0].message
        );

    }

    return result.data;

}

module.exports = validate;