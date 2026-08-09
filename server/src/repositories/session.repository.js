const Session = require("../models/session.model");

class SessionRepository {
    async create(sessionData) {
        return Session.create(sessionData);
    }

    async findByRefreshTokenHash(refreshTokenHash) {
        return Session.findOne({
            refreshToken: refreshTokenHash
        }).select("+refreshToken");
    }

    async deleteById(id) {
        return Session.findByIdAndDelete(id);
    }

    async deleteAllByUser(userId) {
        return Session.deleteMany({ user: userId });
    }

    async updateLastUsed(id) {
        return Session.findByIdAndUpdate(
            id,
            {
                lastUsedAt: new Date(),
            },
            {
                new: true,
            }
        );
    }

    async updateRefreshToken(sessionId, refreshTokenHash, expiresAt) {
        return Session.findByIdAndUpdate(
            sessionId,
            {
                refreshToken: refreshTokenHash,
                expiresAt,
                lastUsedAt: new Date()
            },
            {
                new: true
            }
        );
    }

    async deleteByUserAndRefreshTokenHash(userId, refreshTokenHash) {
        return Session.findOneAndDelete({
            user: userId,
            refreshToken: refreshTokenHash
        });
    }
}

module.exports = new SessionRepository();