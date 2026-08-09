const crypto = require("crypto");

const generateNumericOTP = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return String(
        crypto.randomInt(min, max + 1)
    );
};

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

module.exports = {
    generateNumericOTP,
    hashToken,
};