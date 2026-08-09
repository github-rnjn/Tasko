import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { register as registerUser } from "../../api/auth.api";
import { registerSchema } from "../../schemas/auth.schema";

const Register = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [serverError, setServerError] =
        useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data) => {

        setServerError("");

        try {

            const response = await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            navigate("/verify-email", {
                state: {
                    email: data.email,
                },
            });

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Registration failed. Please try again.";

            setServerError(message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md">

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">

                    {/* Header */}

                    <div className="mb-8">

                        <h1 className="text-2xl font-bold text-slate-900">
                            Create your account
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Get started with Tasko
                        </p>

                    </div>

                    {/* Server Error */}

                    {serverError && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {serverError}
                        </div>
                    )}

                    {/* Form */}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >

                        {/* Name */}

                        <div>

                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Enter your name"
                                {...register("name")}
                                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition
                                    ${
                                        errors.name
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                    }
                                `}
                            />

                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}

                        </div>

                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                {...register("email")}
                                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition
                                    ${
                                        errors.email
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                    }
                                `}
                            />

                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}

                        </div>

                        {/* Password */}

                        <div>

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none transition
                                        ${
                                            errors.password
                                                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                                : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                        }
                                    `}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) => !value
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.password.message}
                                </p>
                            )}

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                    {...register("confirmPassword")}
                                    className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none transition
                                        ${
                                            errors.confirmPassword
                                                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                                : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                        }
                                    `}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (value) => !value
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                            {errors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}

                        </div>

                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
                        >

                            {isSubmitting ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Creating account...
                                </>
                            ) : (
                                "Create account"
                            )}

                        </button>

                    </form>

                    {/* Login */}

                    <p className="mt-6 text-center text-sm text-slate-500">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-medium text-slate-900 hover:underline"
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
};

export default Register;