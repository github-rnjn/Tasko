const { z } = require("zod");

const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2)
        .max(150),

    description: z
        .string()
        .trim()
        .optional(),

    priority: z
        .enum([
            "LOW",
            "MEDIUM",
            "HIGH"
        ])
        .optional(),

    status: z
        .enum([
            "TODO",
            "IN_PROGRESS",
            "COMPLETED"
        ])
        .optional(),

    dueDate: z
        .string()
        .date()
        .optional(),

    category: z
        .string()
        .optional(),

    labels: z
        .array(z.string())
        .optional(),

    estimatedMinutes: z
        .number()
        .min(0)
        .optional()
});

const updateTaskSchema = z.object({
    title: z.string().trim().min(2).max(150).optional(),

    description: z.string().trim().optional(),

    priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH"
    ]).optional(),

    status: z.enum([
        "TODO",
        "IN_PROGRESS",
        "COMPLETED"
    ]).optional(),

    dueDate: z.string().date().optional(),

    category: z.string().optional(),

    labels: z.array(z.string()).optional(),

    estimatedMinutes: z.number().min(0).optional(),

    isArchived: z.boolean().optional()
});

module.exports = {
    createTaskSchema,
    updateTaskSchema
};