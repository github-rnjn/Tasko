const dashboardRepository = require("../repositories/dashboard.repository");

class DashboardService {

    async getSummary(userId) {

        const summary =
            await dashboardRepository.getSummary(userId);

        if (!summary) {

            return {
                totalTasks: 0,
                completedTasks: 0,
                pendingTasks: 0,
                overdueTasks: 0,
                dueToday: 0,
                completionRate: 0
            };

        }

        return {

            ...summary,

            completionRate:

                summary.totalTasks === 0

                    ? 0

                    : Number(

                        (
                            summary.completedTasks
                            /
                            summary.totalTasks
                        ).toFixed(2)

                    ) * 100

        };

    }

    async getCategoryBreakdown(userId) {

        return dashboardRepository.getCategoryBreakdown(
            userId
        );

    }

    async getProductivity(userId) {

        return dashboardRepository.getProductivity(
            userId
        );

    }

}

module.exports = new DashboardService();