const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");

class AuthRepository {

    async findByEmail(email) {
        return User.findOne({ email });
    }

    async findById(userId) {
        return User.findById(userId);
    }

    async create(userData) {
        return User.create(userData);
    }

    async verifyUser(userId) {
        return User.findByIdAndUpdate(
            userId,
            {
                isVerified: true
            },
            {
                new: true
            }
        );
    }

    async findByEmailWithPassword(email) {
        return User.findOne({
            email
        }).select("+password");
    }

    async updateLastLogin(userId) {
        return User.findByIdAndUpdate(
            userId,
            {
                lastLogin: new Date()
            },
            {
                new: true
            }
        );
    }

    async updatePassword(userId, password) {
        const hashedPassword = await bcryptjs.hash(password, 12);

        return User.findByIdAndUpdate(
            userId,
            {
                password: hashedPassword
            },
            {
                new: true
            }
        );
    }
}

module.exports = new AuthRepository();