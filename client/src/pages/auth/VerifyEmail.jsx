import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Loader2, MailCheck } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    resendVerification,
    verifyEmail,
} from "../../api/auth.api";

import { verifyEmailSchema } from "../../schemas/auth.schema";

const VerifyEmail = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const emailFromRegister =
        location.state?.email || "";

    const [serverError, setServerError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [resendCooldown, setResendCooldown] =
        useState(0);

    const {
        register,
        handleSubmit,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            email: emailFromRegister,
            otp: "",
        },
    });

    const email = watch("email");

    /*
     * Resend countdown
     */
    useEffect(() => {

        if (resendCooldown <= 0) {
            return;
        }

        const timer = setInterval(() => {

            setResendCooldown((current) =>
                current - 1
            );

        }, 1000);

        return () => clearInterval(timer);

    }, [resendCooldown]);

    const onSubmit = async (data) => {

        setServerError("");
        setSuccessMessage("");

        try {

            await verifyEmail(data);

            navigate("/login", {
                state: {
                    email: data.email,
                    message:
                        "Email verified successfully. You can now login.",
                },
            });

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Verification failed. Please try again.";

            setServerError(message);
        }
    };

    const handleResend = async () => {

        if (
            resendCooldown > 0 ||
            !email
        ) {
            return;
        }

        setServerError("");
        setSuccessMessage("");

        try {

            await resendVerification({
                email,
            });

            setSuccessMessage(
                "A new verification code has been sent to your email."
            );

            /*
             * Backend allows another request
             * after 30 seconds.
             */
            setResendCooldown(30);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Unable to resend verification code.";

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

                            <MailCheck
                                size={24}
                                className="text-slate-700"
                            />

                        </div>

                    </div>

                    {/* Header */}

                    <div className="text-center mb-8">

                        <h1 className="text-2xl font-bold text-slate-900">
                            Verify your email
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Enter the 6-digit verification code
                            sent to your email.
                        </p>

                    </div>

                    {/* Error */}

                    {serverError && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {serverError}
                        </div>
                    )}

                    {/* Success */}

                    {successMessage && (
                        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                            {successMessage}
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

                        {/* OTP */}

                        <div>

                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Verification code
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

                        {/* Verify */}

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
                                    Verifying...
                                </>
                            ) : (
                                "Verify email"
                            )}

                        </button>

                    </form>

                    {/* Resend */}

                    <div className="mt-6 text-center">

                        <p className="text-sm text-slate-500">
                            Didn't receive the code?
                        </p>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={
                                resendCooldown > 0 ||
                                !email
                            }
                            className="mt-2 text-sm font-medium text-slate-900 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
                        >

                            {resendCooldown > 0
                                ? `Resend code in ${resendCooldown}s`
                                : "Resend verification code"}

                        </button>

                    </div>

                    {/* Login */}

                    <p className="mt-6 text-center text-sm text-slate-500">

                        Already verified?{" "}

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

export default VerifyEmail;