const { z } = require("zod");

const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(50),
});

const changePasswordSchema = z.object({

    currentPassword: z
        .string()
        .min(8)
        .max(100),

    newPassword: z
        .string()
        .min(8)
        .max(100),

});

module.exports = {
    updateProfileSchema,
    changePasswordSchema
};