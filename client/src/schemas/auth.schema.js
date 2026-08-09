import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
        .string()
        .min(8, "Please confirm your password"),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
);

export const verifyEmailSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address"),

    otp: z
        .string()
        .trim()
        .length(6, "Verification code must be 6 characters"),
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must not exceed 100 characters"),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address"),

    otp: z
        .string()
        .trim()
        .length(6, "Reset code must be 6 characters"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must not exceed 100 characters"),
});