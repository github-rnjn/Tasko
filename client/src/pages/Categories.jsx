import { useEffect, useState } from "react";

import {
    AlertCircle,
    Edit,
    Folder,
    Loader2,
    Plus,
    Trash2,
    X,
} from "lucide-react";

import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from "../api/category.api";

const Categories = () => {

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingCategory, setEditingCategory] =
        useState(null);

    const fetchCategories = async () => {

        setLoading(true);
        setError("");

        try {

            const response =
                await getCategories();

            setCategories(
                response.data || []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load categories."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (categoryId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this category?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteCategory(
                categoryId
            );

            await fetchCategories();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to delete category."
            );

        }
    };

    const handleEdit = (category) => {

        setEditingCategory(category);
        setShowForm(true);

    };

    const handleCreate = () => {

        setEditingCategory(null);
        setShowForm(true);

    };

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Categories
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Organize your tasks using categories.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
                >
                    <Plus size={18} />
                    Create Category
                </button>

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
                        onClick={fetchCategories}
                        className="mt-2 text-sm font-medium text-red-700 hover:underline"
                    >
                        Try again
                    </button>

                </div>
            )}


            {/* Loading */}

            {loading && (
                <div className="flex min-h-62.5 items-center justify-center">

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                        <Loader2
                            size={18}
                            className="animate-spin"
                        />

                        Loading categories...

                    </div>

                </div>
            )}


            {/* Empty */}

            {!loading &&
                !error &&
                categories.length === 0 && (

                    <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">

                        <Folder
                            size={40}
                            className="mx-auto text-slate-300"
                        />

                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                            No categories yet
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Create your first category to organize your tasks.
                        </p>

                        <button
                            type="button"
                            onClick={handleCreate}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            <Plus size={18} />
                            Create Category
                        </button>

                    </div>
                )}


            {/* Category grid */}

            {!loading &&
                !error &&
                categories.length > 0 && (

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {categories.map(
                            (category) => (

                                <CategoryCard
                                    key={
                                        category._id
                                    }
                                    category={
                                        category
                                    }
                                    onEdit={
                                        handleEdit
                                    }
                                    onDelete={
                                        handleDelete
                                    }
                                />

                            )
                        )}

                    </div>
                )}


            {/* Category modal */}

            {showForm && (
                <CategoryForm
                    category={
                        editingCategory
                    }
                    onClose={() => {
                        setShowForm(false);
                        setEditingCategory(
                            null
                        );
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingCategory(
                            null
                        );
                        fetchCategories();
                    }}
                />
            )}

        </div>
    );
};


/* =========================================
   Category Card
========================================= */

const CategoryCard = ({
    category,
    onEdit,
    onDelete,
}) => {

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{
                            backgroundColor:
                                `${category.color}20`,
                        }}
                    >
                        <Folder
                            size={20}
                            style={{
                                color:
                                    category.color,
                            }}
                        />
                    </div>

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            {category.name}
                        </h2>

                        {category.isDefault && (
                            <p className="mt-0.5 text-xs text-slate-400">
                                Default category
                            </p>
                        )}

                    </div>

                </div>


                <div className="flex items-center gap-1">

                    <button
                        type="button"
                        onClick={() =>
                            onEdit(category)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                        title="Edit category"
                    >
                        <Edit size={17} />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            onDelete(
                                category._id
                            )
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete category"
                    >
                        <Trash2 size={17} />
                    </button>

                </div>

            </div>

        </div>
    );
};


/* =========================================
   Category Form
========================================= */

const CategoryForm = ({
    category,
    onClose,
    onSuccess,
}) => {

    const [name, setName] =
        useState(category?.name || "");

    const [color, setColor] =
        useState(
            category?.color || "#3B82F6"
        );

    const [icon, setIcon] =
        useState(
            category?.icon || "folder"
        );

    const [error, setError] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (
            name.trim().length < 2 ||
            name.trim().length > 30
        ) {
            setError(
                "Category name must be between 2 and 30 characters."
            );

            return;
        }

        setSubmitting(true);

        try {

            const data = {
                name: name.trim(),
                color,
                icon: icon.trim(),
            };

            if (category) {

                await updateCategory(
                    category._id,
                    data
                );

            } else {

                await createCategory(data);

            }

            onSuccess();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                `Unable to ${
                    category
                        ? "update"
                        : "create"
                } category.`
            );

        } finally {

            setSubmitting(false);

        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                    <div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            {category
                                ? "Edit Category"
                                : "Create Category"}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {category
                                ? "Update your category."
                                : "Add a new category for your tasks."}
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

                {error && (
                    <div className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}


                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >

                    {/* Name */}

                    <div>

                        <label
                            htmlFor="category-name"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Name
                        </label>

                        <input
                            id="category-name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Work"
                            maxLength={30}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                        />

                    </div>


                    {/* Color */}

                    <div>

                        <label
                            htmlFor="category-color"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Color
                        </label>

                        <div className="flex items-center gap-3">

                            <input
                                id="category-color"
                                type="color"
                                value={color}
                                onChange={(event) =>
                                    setColor(
                                        event.target.value
                                    )
                                }
                                className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                            />

                            <input
                                type="text"
                                value={color}
                                onChange={(event) =>
                                    setColor(
                                        event.target.value
                                    )
                                }
                                maxLength={7}
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm uppercase outline-none focus:border-slate-500"
                            />

                        </div>

                    </div>


                    {/* Icon */}

                    <div>

                        <label
                            htmlFor="category-icon"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Icon
                        </label>

                        <input
                            id="category-icon"
                            type="text"
                            value={icon}
                            onChange={(event) =>
                                setIcon(
                                    event.target.value
                                )
                            }
                            maxLength={30}
                            placeholder="folder"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                        />

                        <p className="mt-1.5 text-xs text-slate-400">
                            Icon name used by the category.
                        </p>

                    </div>


                    {/* Actions */}

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {submitting && (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            )}

                            {submitting
                                ? "Saving..."
                                : category
                                    ? "Update Category"
                                    : "Create Category"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default Categories;