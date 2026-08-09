const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVariables = [
    "PORT",
    "MONGODB_URI",
];

requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});

module.exports = {
    PORT: Number(process.env.PORT),
    MONGODB_URI: process.env.MONGODB_URI,
};