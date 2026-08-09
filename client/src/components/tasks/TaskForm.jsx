import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    createTask,
    updateTask,
} from "../../api/task.api";
import { getCategories } from "../../api/category.api";
import { createTaskSchema } from "../../schemas/task.schema";

const TaskForm = ({ task=null,onClose, onSuccess }) => {

    const [categories, setCategories] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(createTaskSchema),

        defaultValues: {
            title: task?.title || "",
            description: task?.description || "",
            priority: task?.priority || "MEDIUM",
            status: task?.status || "TODO",

            dueDate: task?.dueDate
                ? task.dueDate.split("T")[0]
                : "",

            category: task?.category?._id ||
                task?.category ||
                "",

            labels: task?.labels?.join(", ") || "",

            estimatedMinutes:
                task?.estimatedMinutes ?? "",
        },
    });

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response =
                    await getCategories();

                setCategories(
                    response.data || []
                );

            } catch (error) {

                setServerError(
                    error.response?.data?.message ||
                    "Unable to load categories."
                );

            } finally {

                setCategoryLoading(false);

            }
        };

        loadCategories();

    }, []);

    const onSubmit = async (data) => {

        setServerError("");

        try {

            const payload = {
                ...data,

                category:
                    data.category || undefined,

                labels: data.labels
                    ? data.labels
                        .split(",")
                        .map((label) =>
                            label.trim()
                        )
                        .filter(Boolean)
                    : [],

                estimatedMinutes:
                    data.estimatedMinutes
                        ? Number(data.estimatedMinutes)
                        : undefined,
            };

            if (task) {

                await updateTask(
                    task._id,
                    payload
                );

            } else {

                await createTask(payload);

            }

            onSuccess();

        } catch (error) {

            setServerError(
                error.response?.data?.message ||
                `Unable to ${
                    task
                        ? "update"
                        : "create"
                } task.`
            );

        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                    <div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            {task ? "Edit Task" : "Create Task"}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Add a new task to your list.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X size={19} />
                    </button>

                </div>

                {/* Error */}

                {serverError && (
                    <div className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {serverError}
                    </div>
                )}

                {/* Form */}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5 p-6"
                >

                    {/* Title */}

                    <div>

                        <label
                            htmlFor="title"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. Finish project documentation"
                            {...register("title")}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                        />

                        {errors.title && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.title.message}
                            </p>
                        )}

                    </div>

                    {/* Description */}

                    <div>

                        <label
                            htmlFor="description"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            rows={4}
                            placeholder="Describe the task..."
                            {...register("description")}
                            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                        />

                    </div>

                    {/* Status + Priority */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>

                            <label
                                htmlFor="status"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Status
                            </label>

                            <select
                                id="status"
                                {...register("status")}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
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

                        </div>

                        <div>

                            <label
                                htmlFor="priority"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Priority
                            </label>

                            <select
                                id="priority"
                                {...register("priority")}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                            >
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

                    {/* Due date + Estimated time */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>

                            <label
                                htmlFor="dueDate"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Due date
                            </label>

                            <input
                                id="dueDate"
                                type="date"
                                {...register("dueDate")}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                            />

                            {errors.dueDate && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.dueDate.message}
                                </p>
                            )}

                        </div>

                        <div>

                            <label
                                htmlFor="estimatedMinutes"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Estimated minutes
                            </label>

                            <input
                                id="estimatedMinutes"
                                type="number"
                                min="0"
                                placeholder="e.g. 60"
                                {...register(
                                    "estimatedMinutes"
                                )}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                            />

                            {errors.estimatedMinutes && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.estimatedMinutes.message}
                                </p>
                            )}

                        </div>

                    </div>

                    {/* Category */}

                    <div>

                        <label
                            htmlFor="category"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            {...register("category")}
                            disabled={categoryLoading}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"
                        >

                            <option value="">
                                {categoryLoading
                                    ? "Loading categories..."
                                    : "No category"}
                            </option>

                            {categories.map(
                                (category) => (
                                    <option
                                        key={
                                            category._id
                                        }
                                        value={
                                            category._id
                                        }
                                    >
                                        {category.name}
                                    </option>
                                )
                            )}

                        </select>

                    </div>

                    {/* Labels */}

                    <div>

                        <label
                            htmlFor="labels"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Labels
                        </label>

                        <input
                            id="labels"
                            type="text"
                            placeholder="work, backend, urgent"
                            {...register("labels")}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                        />

                        <p className="mt-1.5 text-xs text-slate-400">
                            Separate labels with commas.
                        </p>

                    </div>

                    {/* Actions */}

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {isSubmitting && (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            )}

                            {isSubmitting ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />

                                    {task
                                        ? "Updating..."
                                        : "Creating..."}
                                </>
                            ) : (
                                task
                                    ? "Update Task"
                                    : "Create Task"
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default TaskForm;