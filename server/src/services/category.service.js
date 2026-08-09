const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");

const categoryRepository = require("../repositories/category.repository");

const {toTitleCase} = require("../utils/string");

class CategoryService {

    async create(userId, data) {

        const displayName = data.name
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());

        const normalizedName = displayName.toLowerCase();

        const exists =
            await categoryRepository.findByUserAndNormalizedName(
                userId,
                normalizedName
            );

        if (exists) {
            throw new ApiError(
                HTTP_STATUS.CONFLICT,
                "Category already exists"
            );
        }

        return categoryRepository.create({
            ...data,
            name: displayName,
            normalizedName,
            createdBy: userId,
        });
    }

    async getAll(userId) {

        return categoryRepository.findByUser(userId);

    }

    async update(userId, categoryId, data) {

        const category =
            await categoryRepository.findById(categoryId);

        if (!category) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Category not found"
            );
        }

        if (
            category.createdBy.toString() !== userId.toString()
        ) {
            throw new ApiError(
                HTTP_STATUS.FORBIDDEN,
                "Access denied"
            );
        }

        if (data.name) {

            const displayName =
                toTitleCase(data.name);

            const normalizedName =
                displayName.toLowerCase();

            const duplicate =
                await categoryRepository.findByUserAndNormalizedName(
                    userId,
                    normalizedName
                );

            if (
                duplicate &&
                duplicate._id.toString() !== categoryId
            ) {
                throw new ApiError(
                    HTTP_STATUS.CONFLICT,
                    "Category already exists"
                );
            }

            data.name = displayName;
            data.normalizedName = normalizedName;
        }

        return categoryRepository.update(
            categoryId,
            data
        );

    }

    async delete(userId, categoryId) {

        const category =
            await categoryRepository.findById(categoryId);

        if (!category) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Category not found"
            );
        }

        if (
            category.createdBy.toString() !== userId.toString()
        ) {
            throw new ApiError(
                HTTP_STATUS.FORBIDDEN,
                "Access denied"
            );
        }

        await categoryRepository.delete(categoryId);

    }

}

module.exports = new CategoryService();