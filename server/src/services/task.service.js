const ApiError = require("../utils/ApiError");

const { HTTP_STATUS } = require("../constants");

const taskRepository = require("../repositories/task.repository");
const categoryRepository = require("../repositories/category.repository");

const { toTitleCase } = require("../utils/string");

const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "dueDate",
    "priority",
    "status",
    "title",
];

class TaskService {

    async create(userId, data) {

        if(data.title){
            data.title = toTitleCase(data.title);
        }

        if (data.category) {

            const category =
                await categoryRepository.findByIdAndUser(
                    data.category,
                    userId
                );

            if (!category) {
                throw new ApiError(
                    HTTP_STATUS.NOT_FOUND,
                    "Category not found"
                );
            }

        }

        if (data.labels) {

            data.labels = [
                ...new Set(
                    data.labels
                        .map(label => label.trim().toLowerCase())
                        .filter(Boolean)
                )
            ].sort();

        }

        return taskRepository.create({

            ...data,

            createdBy: userId,

            updatedBy: userId

        });

    }

    async getAll(userId, query) {

        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(query.limit) || 10, 1),
            100
        );

        const filters = {};

        if (query.status)
            filters.status = query.status;

        if (query.priority)
            filters.priority = query.priority;

        if (query.category)
            filters.category = query.category;

        if (query.search?.trim()) {
            filters.$or = [
                {
                    title: {
                        $regex: query.search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: query.search,
                        $options: "i"
                    }
                }
            ];
        }

        const sortBy = allowedSortFields.includes(query.sortBy)?query.sortBy:"createdAt";

        const sortOrder =
            query.sortOrder === "asc"
                ? 1
                : -1;

        const result =
            await taskRepository.findAll(

                userId,

                filters,

                {
                    page,
                    limit,
                    sort: {
                        [sortBy]: sortOrder
                    }
                }

            );

        return {

            tasks: result.tasks,

            pagination: {

                page,

                limit,

                total: result.total,

                totalPages:
                    Math.ceil(result.total / limit),

                hasNextPage:
                    page * limit < result.total,

                hasPreviousPage:
                    page > 1

            }

        };

    }

    async getById(userId, taskId) {

        const task =
            await taskRepository.findByIdAndUser(
                taskId,
                userId
            );

        if (!task) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Task not found"
            );
        }

        return task;
    }

    async update(userId, taskId, data) {

        if(data.title){
            data.title = toTitleCase(data.title);
        }

        const task =
            await taskRepository.findByIdAndUser(
                taskId,
                userId
            );

        if (!task) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Task not found"
            );
        }

        if (data.category) {

            const category =
                await categoryRepository.findByIdAndUser(
                    data.category,
                    userId
                );

            if (!category) {
                throw new ApiError(
                    HTTP_STATUS.NOT_FOUND,
                    "Category not found"
                );
            }

        }

        if (data.labels) {

            data.labels = [
                ...new Set(
                    data.labels
                        .map(label =>
                            label.trim().toLowerCase()
                        )
                        .filter(Boolean)
                )
            ];

        }

        if (
            task.status !== "COMPLETED" &&
            data.status === "COMPLETED"
        ) {
            data.completedAt = new Date();
        }

        if (
            task.status === "COMPLETED" &&
            data.status &&
            data.status !== "COMPLETED"
        ) {
            data.completedAt = null;
        }

        data.updatedBy = userId;

        return taskRepository.update(
            taskId,
            data
        );

    }

    async archive(userId, taskId) {

        const task =
            await taskRepository.findByIdAndUser(
                taskId,
                userId
            );

        if (!task) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Task not found"
            );
        }

        await taskRepository.archive(taskId,userId);

    }
}

module.exports = new TaskService();