const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories
} = require("../controllers/category.controller");

const {
    createCategorySchema,
    updateCategorySchema
} = require("../validators/category.validator");

router.post(
    "/",
    authMiddleware,
    validate(createCategorySchema),
    createCategory
);

router.get(
    "/",
    authMiddleware,
    getCategories
);

router.patch(
    "/:id",
    authMiddleware,
    validate(updateCategorySchema),
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    deleteCategory
);

module.exports = router;