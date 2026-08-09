const VerificationToken = require("../models/verificationToken.model");

class VerificationTokenRepository {

    async create(data) {
        return VerificationToken.create(data);
    }

    async findByUser(userId, type) {
        return VerificationToken.findOne({
            user: userId,
            type
        })
        .select("+tokenHash")
        .sort({ createdAt: -1 });
    }

    async deleteByUser(userId, type) {
        return VerificationToken.deleteMany({
            user: userId,
            type,
        });
    }

}

module.exports = new VerificationTokenRepository();