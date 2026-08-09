import { useEffect, useState } from "react";

import {
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Edit,
    Loader2,
    Plus,
    Search,
    Trash2,
} from "lucide-react";

import {
    deleteTask,
    getTasks,
    updateTask,
} from "../api/task.api";

import TaskForm from "../components/tasks/TaskForm";

const Tasks = () => {

    const [tasks, setTasks] = useState([]);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        priority: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const [editingTask, setEditingTask] = useState(null);

    const [deletingTaskId, setDeletingTaskId] = useState(null);

    const [showCreateForm, setShowCreateForm] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const fetchTasks = async (
        page = 1
    ) => {

        setLoading(true);
        setError("");

        try {

            const response = await getTasks({
                page,
                limit: 10,

                ...(filters.search && {
                    search: filters.search,
                }),

                ...(filters.status && {
                    status: filters.status,
                }),

                ...(filters.priority && {
                    priority: filters.priority,
                }),

                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            });

            setTasks(response.data.tasks);

            setPagination(
                response.data.pagination
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load tasks."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchTasks(1);

    }, [
        filters.status,
        filters.priority,
        filters.sortBy,
        filters.sortOrder,
    ]);

    const handleSearch = (event) => {

        if (event.key === "Enter") {
            fetchTasks(1);
        }
    };

    const handleFilterChange = (
        field,
        value
    ) => {

        setFilters((current) => ({
            ...current,
            [field]: value,
        }));

    };

    const handleDelete = async (taskId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this task?"
            );

        if (!confirmed) {
            return;
        }

        setDeletingTaskId(taskId);

        try {

            await deleteTask(taskId);

            await fetchTasks(
                pagination.page
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to delete task."
            );

        } finally {

            setDeletingTaskId(null);

        }
    };

    const handleStatusChange = async (
        taskId,
        status
    ) => {

        try {

            await updateTask(
                taskId,
                { status }
            );

            await fetchTasks(
                pagination.page
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to update task status."
            );

        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Tasks
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Create, organize and manage your tasks.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
                >
                    <Plus size={18} />
                    Create Task
                </button>

            </div>


            {/* Filters */}

            <div className="rounded-xl border border-slate-200 bg-white p-4">

                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

                    {/* Search */}

                    <div className="relative md:col-span-2">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={filters.search}
                            onChange={(event) =>
                                handleFilterChange(
                                    "search",
                                    event.target.value
                                )
                            }
                            onKeyDown={handleSearch}
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                        />

                    </div>


                    {/* Status */}

                    <select
                        value={filters.status}
                        onChange={(event) =>
                            handleFilterChange(
                                "status",
                                event.target.value
                            )
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500"
                    >

                        <option value="">
                            All statuses
                        </option>

                        <option value="TODO">
                            To Do
                        </option>

                        <option value="IN_PROGRESS">
                            In Progress
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                    </select>


                    {/* Priority */}

                    <select
                        value={filters.priority}
                        onChange={(event) =>
                            handleFilterChange(
                                "priority",
                                event.target.value
                            )
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500"
                    >

                        <option value="">
                            All priorities
                        </option>

                        <option value="LOW">
                            Low
                        </option>

                        <option value="MEDIUM">
                            Medium
                        </option>

                        <option value="HIGH">
                            High
                        </option>

                    </select>

                </div>

            </div>


            {/* Error */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-center gap-2 text-red-600">

                        <AlertCircle size={18} />

                        <span className="text-sm font-medium">
                            {error}
                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            fetchTasks(
                                pagination.page
                            )
                        }
                        className="mt-2 text-sm font-medium text-red-700 hover:underline"
                    >
                        Try again
                    </button>

                </div>
            )}


            {/* Loading */}

            {loading && (
                <div className="flex min-h-[250px] items-center justify-center">

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                        <Loader2
                            size={18}
                            className="animate-spin"
                        />

                        Loading tasks...

                    </div>

                </div>
            )}


            {/* Empty */}

            {!loading &&
                !error &&
                tasks.length === 0 && (

                    <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">

                        <h2 className="text-lg font-semibold text-slate-900">
                            No tasks found
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Create your first task to get started.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowCreateForm(true)}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            <Plus size={18} />
                            Create Task
                        </button>

                    </div>
                )}


            {/* Task list */}

            {!loading &&
                !error &&
                tasks.length > 0 && (

                    <div className="space-y-3">

                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={setEditingTask}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                                deleting={
                                    deletingTaskId === task._id
                                }
                            />
                        ))}

                    </div>
                )}


            {/* Pagination */}

            {!loading &&
                !error &&
                tasks.length > 0 && (

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">

                        <p className="text-sm text-slate-500">

                            Page{" "}

                            <span className="font-medium text-slate-700">
                                {pagination.page}
                            </span>

                            {" "}of{" "}

                            <span className="font-medium text-slate-700">
                                {pagination.totalPages}
                            </span>

                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={
                                    !pagination.hasPreviousPage
                                }
                                onClick={() =>
                                    fetchTasks(
                                        pagination.page - 1
                                    )
                                }
                                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <button
                                type="button"
                                disabled={
                                    !pagination.hasNextPage
                                }
                                onClick={() =>
                                    fetchTasks(
                                        pagination.page + 1
                                    )
                                }
                                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={18} />
                            </button>

                        </div>

                    </div>
                )}

                {/* Create Task Modal */}

                {showCreateForm && (
                    <TaskForm
                        onClose={() =>
                            setShowCreateForm(false)
                        }
                        onSuccess={() => {
                            setShowCreateForm(false);
                            fetchTasks(1);
                        }}
                    />
                )}

                {editingTask && (
                    <TaskForm
                        task={editingTask}
                        onClose={() =>
                            setEditingTask(null)
                        }
                        onSuccess={() => {
                            setEditingTask(null);
                            fetchTasks(
                                pagination.page
                            );
                        }}
                    />
                )}
        </div>
    );
};


/* =========================================
   Task Card
========================================= */

const TaskCard = ({
    task,
    onEdit,
    onDelete,
    onStatusChange,
    deleting,
}) => {

    const statusLabel = {
        TODO: "To Do",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
    };

    const priorityLabel = {
        LOW: "Low",
        MEDIUM: "Medium",
        HIGH: "High",
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                {/* Task information */}

                <div className="min-w-0 flex-1">

                    <h2
                        className={`font-semibold ${
                            task.status === "COMPLETED"
                                ? "text-slate-400 line-through"
                                : "text-slate-900"
                        }`}
                    >
                        {task.title}
                    </h2>

                    {task.description && (
                        <p className="mt-1.5 text-sm text-slate-500">
                            {task.description}
                        </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">

                        <Badge>
                            {statusLabel[task.status]}
                        </Badge>

                        <Badge>
                            {priorityLabel[task.priority]}
                        </Badge>

                        {task.category && (
                            <Badge>
                                {task.category.name}
                            </Badge>
                        )}

                        {task.labels?.map(
                            (label) => (
                                <Badge
                                    key={label}
                                >
                                    #{label}
                                </Badge>
                            )
                        )}

                    </div>

                </div>


                {/* Actions */}

                <div className="flex flex-wrap items-center gap-2">

                    {/* Status */}

                    <select
                        value={task.status}
                        onChange={(event) =>
                            onStatusChange(
                                task._id,
                                event.target.value
                            )
                        }
                        className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs text-slate-600 outline-none hover:bg-slate-50"
                    >

                        <option value="TODO">
                            To Do
                        </option>

                        <option value="IN_PROGRESS">
                            In Progress
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                    </select>


                    {/* Edit */}

                    <button
                        type="button"
                        onClick={() =>
                            onEdit(task)
                        }
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        title="Edit task"
                    >
                        <Edit size={17} />
                    </button>


                    {/* Delete */}

                    <button
                        type="button"
                        onClick={() =>
                            onDelete(task._id)
                        }
                        disabled={deleting}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        title="Delete task"
                    >
                        {deleting ? (
                            <Loader2
                                size={17}
                                className="animate-spin"
                            />
                        ) : (
                            <Trash2 size={17} />
                        )}
                    </button>

                </div>

            </div>


            {/* Due date */}

            <div className="mt-4 border-t border-slate-100 pt-3">

                <span className="text-xs text-slate-400">

                    {task.dueDate
                        ? `Due ${new Date(
                            task.dueDate
                        ).toLocaleDateString(
                            "en-IN"
                        )}`
                        : "No due date"}

                </span>

            </div>

        </div>
    );
};


/* =========================================
   Badge
========================================= */

const Badge = ({ children }) => {

    return (
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {children}
        </span>
    );
};

export default Tasks;