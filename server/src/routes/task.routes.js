const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
} = require("../controllers/task.controller");

const {
    createTaskSchema,
    updateTaskSchema
} = require("../validators/task.validator");

router.post(
    "/",
    authMiddleware,
    validate(createTaskSchema),
    createTask
);

router.get(
    "/",
    authMiddleware,
    getTasks
);

router.get(
    "/:id",
    authMiddleware,
    getTask
);

router.patch(
    "/:id",
    authMiddleware,
    validate(updateTaskSchema),
    updateTask
);

router.delete(
    "/:id",
    authMiddleware,
    deleteTask
);

module.exports = router;