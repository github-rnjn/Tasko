const Category = require("../models/category.model");

class CategoryRepository {

    async create(data) {
        return Category.create(data);
    }

    async findByUser(userId) {
        return Category.find({ createdBy: userId });
    }

    async findById(id) {
        return Category.findById(id);
    }

    async findByIdAndUser(categoryId, userId) {
        return Category.findOne({
            _id: categoryId,
            createdBy: userId,
        });
    }

    async findByUserAndNormalizedName(userId, normalizedName) {
        return Category.findOne({
            createdBy: userId,
            normalizedName,
        });
    }

    async update(id, data) {
        return Category.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id) {
        return Category.findByIdAndDelete(id);
    }
}

module.exports = new CategoryRepository();