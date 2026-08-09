const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
        
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcryptjs.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (password) {
    return bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);