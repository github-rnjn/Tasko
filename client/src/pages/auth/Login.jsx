import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../context/AuthContext";
import { loginSchema } from "../../schemas/auth.schema";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const [showPassword, setShowPassword] =
        useState(false);

    const [serverError, setServerError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: location.state?.email || "",
            password: "",
        },
    });

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);

            /*
             * Prevent the message from appearing again
             * if the user refreshes/navigates back.
             */
            window.history.replaceState(
                {},
                document.title
            );
        }
    }, [location.state]);

    const onSubmit = async (data) => {
        setServerError("");

        try {
            await login(data);

            navigate("/dashboard", {
                replace: true,
            });

        } catch (error) {

            const status =
                error.response?.status;

            const message =
                error.response?.data?.message ||
                "Login failed. Please try again.";

            /*
             * Your backend returns 403 when the
             * email has not been verified.
             */
            if (status === 403) {

                navigate("/verify-email", {
                    state: {
                        email: data.email,
                    },
                });

                return;
            }

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
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Login to your Tasko account
                        </p>

                    </div>

                    {/* Success */}

                    {successMessage && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                            {successMessage}
                        </div>
                    )}

                    {/* Error */}

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
                                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                                    errors.email
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                }`}
                            />

                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}

                        </div>

                        {/* Password */}

                        <div>

                            <div className="flex items-center justify-between mb-1.5">

                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-medium text-slate-700 hover:underline"
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            <div className="relative">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none transition ${
                                        errors.password
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                    }`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) => !value
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
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
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}

                        </button>

                    </form>

                    {/* Register */}

                    <p className="mt-6 text-center text-sm text-slate-500">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-medium text-slate-900 hover:underline"
                        >
                            Create account
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;