const { z } = require("zod");

const registerSchema = z.object({
    name: z.string().trim().min(2).max(50),

    email: z.string().trim().email(),

    password: z.string().min(8).max(100)
});

const verifyEmailSchema = z.object({
    email: z.string().trim().email(),

    otp: z
        .string()
        .trim()
        .length(6)
});

const resendVerificationSchema = z.object({
    email: z
        .string()
        .trim()
        .email()
});

const loginSchema = z.object({
    email: z.string().trim().email(),

    password: z.string().min(8).max(100)
});

const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .email()
});

const resetPasswordSchema = z.object({

    email: z.string().trim().email(),

    otp: z.string().trim().length(6),

    password: z.string().min(8).max(100)

});

const createCategorySchema = z.object({

    name: z
        .string()
        .trim()
        .min(2)
        .max(30),

    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/),

    icon: z
        .string()
        .trim()
        .max(30)

});

module.exports = {
    registerSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    createCategorySchema
};