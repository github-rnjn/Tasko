const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30,
        },

        normalizedName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        color: {
            type: String,
            default: "#3B82F6",
        },

        icon: {
            type: String,
            default: "folder",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

categorySchema.index(
    {
        createdBy: 1,
        name: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model("Category", categorySchema);