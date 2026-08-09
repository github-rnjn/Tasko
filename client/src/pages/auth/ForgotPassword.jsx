import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ArrowLeft, Loader2, Mail } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPassword } from "../../api/auth.api";
import { forgotPasswordSchema } from "../../schemas/auth.schema";

const ForgotPassword = () => {

    const navigate = useNavigate();

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
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data) => {

        setServerError("");

        try {

            await forgotPassword(data);

            navigate("/reset-password", {
                state: {
                    email: data.email,
                },
            });

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Unable to send reset code. Please try again.";

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
                            <Mail
                                size={24}
                                className="text-slate-700"
                            />
                        </div>

                    </div>

                    {/* Header */}

                    <div className="text-center mb-8">

                        <h1 className="text-2xl font-bold text-slate-900">
                            Forgot your password?
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Enter your email and we'll send you
                            a password reset code.
                        </p>

                    </div>

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
                                    Sending code...
                                </>
                            ) : (
                                "Send reset code"
                            )}

                        </button>

                    </form>

                    {/* Back to login */}

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

export default ForgotPassword;