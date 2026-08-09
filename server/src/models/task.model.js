const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        status: {
            type: String,
            enum: [
                "TODO",
                "IN_PROGRESS",
                "COMPLETED",
            ],
            default: "TODO",
            index: true,
        },

        priority: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
            ],
            default: "MEDIUM",
        },

        dueDate: {
            type: Date,
        },

        completedAt: {
            type: Date,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },

        labels: [
            {
                type: String,
                trim: true,
            },
        ],

        estimatedMinutes: {
            type: Number,
            min: 0,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

taskSchema.index({
    createdBy: 1,
    status: 1,
});

taskSchema.index({
    createdBy: 1,
    dueDate: 1,
});

module.exports = mongoose.model("Task", taskSchema);