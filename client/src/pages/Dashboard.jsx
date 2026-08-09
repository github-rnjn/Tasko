import { useEffect, useState } from "react";

import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    ListTodo,
    Loader2,
} from "lucide-react";

import { getDashboard } from "../api/dashboard.api";

const Dashboard = () => {

    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await getDashboard();

            setData(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">

                <div className="flex items-center gap-2 text-sm text-slate-500">

                    <Loader2
                        size={18}
                        className="animate-spin"
                    />

                    Loading dashboard...

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                <div className="flex items-center gap-2 text-red-600">

                    <AlertCircle size={19} />

                    <p className="text-sm font-medium">
                        {error}
                    </p>

                </div>

                <button
                    onClick={fetchDashboard}
                    className="mt-3 text-sm font-medium text-red-700 hover:underline"
                >
                    Try again
                </button>

            </div>
        );
    }

    const {
        dashboard = {},
        productivity = [],
        categoryBreakdown = [],
    } = data || {};

    const {
        totalTasks = 0,
        completedTasks = 0,
        pendingTasks = 0,
        overdueTasks = 0,
        dueToday = 0,
        completionRate = 0,
    } = dashboard;

    return (
        <div className="space-y-6">

            {/* Header */}

            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Here's an overview of your tasks and productivity.
                </p>
            </div>


            {/* Summary cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <StatCard
                    title="Total Tasks"
                    value={totalTasks}
                    icon={ListTodo}
                />

                <StatCard
                    title="Completed"
                    value={completedTasks}
                    icon={CheckCircle2}
                />

                <StatCard
                    title="Pending"
                    value={pendingTasks}
                    icon={Clock3}
                />

                <StatCard
                    title="Overdue"
                    value={overdueTasks}
                    icon={AlertCircle}
                />

            </div>


            {/* Secondary information */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Productivity */}

                <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Productivity
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Completed tasks over the last 7 days
                            </p>
                        </div>

                        <div className="text-right">

                            <p className="text-2xl font-bold text-slate-900">
                                {completionRate}%
                            </p>

                            <p className="text-xs text-slate-500">
                                completion rate
                            </p>

                        </div>

                    </div>


                    <ProductivityChart
                        productivity={productivity}
                    />

                </div>


                {/* Today */}

                <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <h2 className="font-semibold text-slate-900">
                        Today
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Task overview
                    </p>

                    <div className="mt-6 space-y-4">

                        <InfoRow
                            label="Due today"
                            value={dueToday}
                        />

                        <InfoRow
                            label="Overdue"
                            value={overdueTasks}
                        />

                        <InfoRow
                            label="Completed"
                            value={completedTasks}
                        />

                        <InfoRow
                            label="Pending"
                            value={pendingTasks}
                        />

                    </div>

                </div>

            </div>


            {/* Categories */}

            <div className="rounded-xl border border-slate-200 bg-white p-5">

                <div>
                    <h2 className="font-semibold text-slate-900">
                        Tasks by category
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Distribution of your active tasks
                    </p>
                </div>

                <CategoryBreakdown
                    categories={categoryBreakdown}
                />

            </div>

        </div>
    );
};


/* =========================================
   Stat Card
========================================= */

const StatCard = ({
    title,
    value,
    icon: Icon,
}) => {

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                    {title}
                </p>

                <Icon
                    size={19}
                    className="text-slate-400"
                />

            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
                {value}
            </p>

        </div>
    );
};


/* =========================================
   Productivity
========================================= */

const ProductivityChart = ({
    productivity,
}) => {

    if (!productivity.length) {
        return (
            <div className="h-48 flex items-center justify-center">

                <p className="text-sm text-slate-400">
                    No completed tasks in the last 7 days.
                </p>

            </div>
        );
    }

    const maxValue = Math.max(
        ...productivity.map(
            (item) => item.completed
        ),
        1
    );

    return (
        <div className="mt-8 h-48 flex items-end gap-3">

            {productivity.map((item) => {

                const height =
                    Math.max(
                        (item.completed / maxValue) * 100,
                        8
                    );

                const date =
                    new Date(
                        `${item._id}T00:00:00`
                    );

                const label =
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            weekday: "short",
                        }
                    );

                return (
                    <div
                        key={item._id}
                        className="flex-1 h-full flex flex-col items-center justify-end gap-2"
                    >

                        <span className="text-xs text-slate-500">
                            {item.completed}
                        </span>

                        <div
                            className="w-full max-w-10 rounded-t-md bg-slate-800 transition-all"
                            style={{
                                height: `${height}%`,
                            }}
                        />

                        <span className="text-xs text-slate-400">
                            {label}
                        </span>

                    </div>
                );
            })}

        </div>
    );
};


/* =========================================
   Category Breakdown
========================================= */

const CategoryBreakdown = ({
    categories,
}) => {

    if (!categories.length) {
        return (
            <div className="py-10 text-center">

                <p className="text-sm text-slate-400">
                    No tasks available yet.
                </p>

            </div>
        );
    }

    const total =
        categories.reduce(
            (sum, category) =>
                sum + category.count,
            0
        );

    return (
        <div className="mt-5 space-y-4">

            {categories.map((category, index) => {

                const percentage =
                    total === 0
                        ? 0
                        : Math.round(
                            (category.count / total) * 100
                        );

                const name =
                    category.name ||
                    "Uncategorized";

                const color =
                    category.color ||
                    "#94A3B8";

                return (
                    <div
                        key={
                            category.categoryId ||
                            `uncategorized-${index}`
                        }
                    >

                        <div className="flex items-center justify-between mb-1.5">

                            <div className="flex items-center gap-2">

                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{
                                        backgroundColor: color,
                                    }}
                                />

                                <span className="text-sm text-slate-700">
                                    {name}
                                </span>

                            </div>

                            <span className="text-xs text-slate-500">
                                {category.count}
                            </span>

                        </div>

                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">

                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: color,
                                }}
                            />

                        </div>

                    </div>
                );
            })}

        </div>
    );
};


/* =========================================
   Info Row
========================================= */

const InfoRow = ({
    label,
    value,
}) => {

    return (
        <div className="flex items-center justify-between">

            <span className="text-sm text-slate-500">
                {label}
            </span>

            <span className="text-sm font-semibold text-slate-900">
                {value}
            </span>

        </div>
    );
};

export default Dashboard;