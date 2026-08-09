const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const { HTTP_STATUS } = require("../constants");

const taskService = require("../services/task.service");

const createTask = asyncHandler(async (req, res) => {

    const task =
        await taskService.create(
            req.user._id,
            req.body
        );

    return res.status(HTTP_STATUS.CREATED).json(

        new ApiResponse(
            HTTP_STATUS.CREATED,
            "Task created successfully",
            task
        )

    );

});

const getTasks = asyncHandler(async (req, res) => {

    const result =
        await taskService.getAll(
            req.user._id,
            req.query
        );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(
            HTTP_STATUS.OK,
            "Tasks fetched successfully",
            result
        )

    );

});

const getTask = asyncHandler(async (req, res) => {

    const task =
        await taskService.getById(
            req.user._id,
            req.params.id
        );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(
            HTTP_STATUS.OK,
            "Task fetched successfully",
            task
        )

    );

});

const updateTask = asyncHandler(async (req, res) => {

    const task =
        await taskService.update(

            req.user._id,

            req.params.id,

            req.body

        );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(
            HTTP_STATUS.OK,
            "Task updated successfully",
            task
        )

    );

});

const deleteTask = asyncHandler(async (req, res) => {

    await taskService.archive(
        req.user._id,
        req.params.id
    );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(
            HTTP_STATUS.OK,
            "Task deleted successfully"
        )

    );

});

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
};