const User = require("../models/user.model");

class ProfileRepository {

    async findById(id) {

        return User.findById(id)
            .select(
                "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -passwordResetToken -passwordResetTokenExpiry"
            );

    }

    async updateById(id, data) {

        return User.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        ).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -passwordResetToken -passwordResetTokenExpiry"
        );

    }

    async updatePassword(id, hashedPassword) {

        return User.findByIdAndUpdate(
            id,
            {
                password: hashedPassword,
            },
            {
                new: true,
            }
        );

    }

    async updateAvatar(id, avatar) {

        return User.findByIdAndUpdate(
            id,
            {
                avatar,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -passwordResetToken -passwordResetTokenExpiry"
        );

    }

}

module.exports = new ProfileRepository();