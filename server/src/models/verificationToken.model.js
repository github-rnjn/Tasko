const mongoose = require("mongoose");

const verificationTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        tokenHash: {
            type: String,
            required: true,
            select: false,
        },

        type: {
            type: String,
            enum: [
                "EMAIL_VERIFICATION",
                "PASSWORD_RESET",
                "EMAIL_CHANGE",
            ],
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "VerificationToken",
    verificationTokenSchema
);