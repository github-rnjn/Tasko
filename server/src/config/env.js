const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVariables = [
    "PORT",
    "MONGODB_URI",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "EMAIL_FROM",
    "CLIENT_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
];

requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});

module.exports = {
    PORT: Number(process.env.PORT),
    MONGODB_URI: process.env.MONGODB_URI,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    CLIENT_URL: process.env.CLIENT_URL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
};