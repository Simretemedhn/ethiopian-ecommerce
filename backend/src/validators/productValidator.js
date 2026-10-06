const { z } =
    require("zod");

const createProductSchema =
    z.object({
        body: z.object({
            name: z
                .string()
                .trim()
                .min(
                    2,
                    "Product name must be at least 2 characters"
                )
                .max(
                    100,
                    "Product name cannot exceed 100 characters"
                ),

            description: z
                .string()
                .trim()
                .min(
                    5,
                    "Description must be at least 5 characters"
                )
                .max(
                    2000,
                    "Description cannot exceed 2000 characters"
                ),

            price: z
                .number()
                .positive(
                    "Price must be greater than 0"
                ),

            category: z
                .string()
                .trim()
                .min(
                    2,
                    "Category must be at least 2 characters"
                )
                .max(
                    50,
                    "Category cannot exceed 50 characters"
                )
        }),

        params: z.object({}),

        query: z.object({})
    });

const updateProductSchema =
    z.object({
        body: z.object({
            name: z
                .string()
                .trim()
                .min(2)
                .max(100),

            description: z
                .string()
                .trim()
                .min(5)
                .max(2000),

            price: z
                .number()
                .positive(),

            category: z
                .string()
                .trim()
                .min(2)
                .max(50)
        }),

        params: z.object({
            id: z
                .string()
                .min(1)
        }),

        query: z.object({})
    });

const getProductSchema =
    z.object({
        body: z.object({}),

        params: z.object({
            id: z
                .string()
                .min(1)
        }),

        query: z.object({})
    });

module.exports = {
    createProductSchema,
    updateProductSchema,
    getProductSchema
};