const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { HTTP_STATUS } = require("../constants");

const categoryService = require("../services/category.service");

const createCategory = asyncHandler(async (req, res) => {

    const category =
        await categoryService.create(
            req.user._id,
            req.body
        );

    return res.status(HTTP_STATUS.CREATED).json(

        new ApiResponse(
            HTTP_STATUS.CREATED,
            "Category created successfully",
            category
        )

    );

});

const getCategories = asyncHandler(async (req, res) => {

    const categories =
        await categoryService.getAll(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Categories fetched successfully",
            categories
        )
    );

});

const updateCategory = asyncHandler(async (req, res) => {

    const category =
        await categoryService.update(
            req.user._id,
            req.params.id,
            req.body
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Category updated successfully",
            category
        )
    );

});

const deleteCategory = asyncHandler(async (req, res) => {

    await categoryService.delete(
        req.user._id,
        req.params.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Category deleted successfully"
        )
    );

});

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};