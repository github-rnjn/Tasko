const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const { HTTP_STATUS } = require("../constants");

const dashboardService = require("../services/dashboard.service");

const getDashboard = asyncHandler(async (req, res) => {

    const dashboard =
        await dashboardService.getSummary(
            req.user._id
        );
    
    const productivity =
        await dashboardService.getProductivity(req.user._id);
    
    const categoryBreakdown =
        await dashboardService.getCategoryBreakdown(req.user._id);

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(
            HTTP_STATUS.OK,
            "Dashboard fetched successfully",
            {dashboard,productivity,categoryBreakdown}
        )

    );

});

module.exports = {
    getDashboard
};