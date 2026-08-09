const { z } = require("zod");

const createCategorySchema = z.object({
    name: z.string().trim().min(2).max(30),

    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .optional(),

    icon: z
        .string()
        .trim()
        .max(30)
        .optional()
});

const updateCategorySchema =
    createCategorySchema.partial();

module.exports = {
    createCategorySchema,
    updateCategorySchema
};