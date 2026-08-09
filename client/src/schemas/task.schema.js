import { z } from "zod";

export const createTaskSchema = z.object({

    title: z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters")
        .max(150, "Title must not exceed 150 characters"),

    description: z
        .string()
        .trim()
        .optional(),

    priority: z
        .enum([
            "LOW",
            "MEDIUM",
            "HIGH",
        ])
        .optional(),

    status: z
        .enum([
            "TODO",
            "IN_PROGRESS",
            "COMPLETED",
        ])
        .optional(),

    dueDate: z
        .string()
        .optional(),

    category: z
        .string()
        .optional(),

    labels: z
        .string()
        .optional(),

    estimatedMinutes: z
        .coerce
        .number()
        .min(0)
        .optional(),
});

export const updateTaskSchema = z.object({

    title: z
        .string()
        .trim()
        .min(2)
        .max(150)
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),

    priority: z
        .enum([
            "LOW",
            "MEDIUM",
            "HIGH",
        ])
        .optional(),

    status: z
        .enum([
            "TODO",
            "IN_PROGRESS",
            "COMPLETED",
        ])
        .optional(),

    dueDate: z
        .string()
        .optional(),

    category: z
        .string()
        .optional(),

    labels: z
        .string()
        .optional(),

    estimatedMinutes: z
        .coerce
        .number()
        .min(0)
        .optional(),

    isArchived: z
        .boolean()
        .optional(),
});