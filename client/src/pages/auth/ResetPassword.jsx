import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPassword } from "../../api/auth.api";
import { resetPasswordSchema } from "../../schemas/auth.schema";

const ResetPassword = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const emailFromForgotPassword =
        location.state?.email || "";

    const [showPassword, setShowPassword] =
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
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: emailFromForgotPassword,
            otp: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {

        setServerError("");

        try {

            await resetPassword(data);

            navigate("/login", {
                state: {
                    email: data.email,
                    message:
                        "Password reset successfully. Please login with your new password.",
                },
            });

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Unable to reset password. Please try again.";

            setServerError(message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md">

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">

                    {/* Icon */}

                    <div className="flex justify-center mb-5">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <LockKeyhole
                                size={24}
                                className="text-slate-700"
                            />
                        </div>

                    </div>

                    {/* Header */}

                    <div className="text-center mb-8">

                        <h1 className="text-2xl font-bold text-slate-900">
                            Reset your password
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Enter the 6-digit code from your
                            email and choose a new password.
                        </p>

                    </div>

                    {/* Error */}

                    {serverError && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {serverError}
                        </div>
                    )}

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

                        {/* OTP */}

                        <div>

                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Reset code
                            </label>

                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                placeholder="Enter 6-digit code"
                                {...register("otp")}
                                className={`w-full rounded-lg border px-3 py-2.5 text-center tracking-[0.35em] text-lg font-medium outline-none transition ${
                                    errors.otp
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                }`}
                            />

                            {errors.otp && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.otp.message}
                                </p>
                            )}

                        </div>

                        {/* Password */}

                        <div>

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                New password
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
                                    placeholder="Enter your new password"
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
                                    Resetting password...
                                </>
                            ) : (
                                "Reset password"
                            )}

                        </button>

                    </form>

                    <div className="mt-6 text-center">

                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ResetPassword;