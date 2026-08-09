const mongoose = require("mongoose");

const Task = require("../models/task.model");

class DashboardRepository {

    async getSummary(userId) {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const result = await Task.aggregate([

            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId),
                    isArchived: false
                }
            },

            {
                $group: {

                    _id: null,

                    totalTasks: {
                        $sum: 1
                    },

                    completedTasks: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "COMPLETED"
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },

                    pendingTasks: {
                        $sum: {
                            $cond: [
                                {
                                    $ne: [
                                        "$status",
                                        "COMPLETED"
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },

                    overdueTasks: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        {
                                            $lt: [
                                                "$dueDate",
                                                today
                                            ]
                                        },
                                        {
                                            $ne: [
                                                "$status",
                                                "COMPLETED"
                                            ]
                                        }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },

                    dueToday: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        {
                                            $gte: [
                                                "$dueDate",
                                                today
                                            ]
                                        },
                                        {
                                            $lt: [
                                                "$dueDate",
                                                tomorrow
                                            ]
                                        }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }

                }
            }

        ]);

        return result[0] || null;

    }

    async getCategoryBreakdown(userId) {

        return Task.aggregate([

            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId),
                    isArchived: false
                }
            },

            {
                $group: {
                    _id: "$category",
                    count: {
                        $sum: 1
                    }
                }
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },

            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    _id: 0,
                    categoryId: "$category._id",
                    name: "$category.name",
                    color: "$category.color",
                    icon: "$category.icon",
                    count: 1
                }
            },

            {
                $sort: {
                    count: -1
                }
            }

        ]);

    }

    async getProductivity(userId) {

        const last7Days = new Date();

        last7Days.setDate(last7Days.getDate() - 6);

        last7Days.setHours(0, 0, 0, 0);

        return Task.aggregate([

            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId),
                    status: "COMPLETED",
                    completedAt: {
                        $gte: last7Days
                    }
                }
            },

            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$completedAt"
                        }
                    },
                    completed: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            }

        ]);

    }

}

module.exports = new DashboardRepository();