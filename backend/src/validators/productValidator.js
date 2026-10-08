const { z } = require("zod");
const mongoose = require("mongoose");


// ============================================
// REUSABLE PRODUCT FIELDS
// ============================================

const productFields = {

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
};


// ============================================
// PRODUCT ID VALIDATOR
// ============================================

const productIdSchema =
    z
        .string()
        .refine(
            (id) => mongoose.isValidObjectId(id),
            "Invalid product ID"
        );


// ============================================
// CREATE PRODUCT
// ============================================

const createProductSchema =
    z.object({

        body: z.object(
            productFields
        ),

        params: z.object({}),

        query: z.object({})
    });


// ============================================
// UPDATE PRODUCT
// ============================================

const updateProductSchema =
    z.object({

        body: z.object(
            productFields
        ),

        params: z.object({

            id: productIdSchema

        }),

        query: z.object({})
    });


// ============================================
// GET ONE PRODUCT
// ============================================

const getProductSchema =
    z.object({

        body: z.object({}),

        params: z.object({

            id: productIdSchema

        }),

        query: z.object({})
    });


// ============================================
// GET ALL PRODUCTS
// ============================================

const getProductsQuerySchema =
    z.object({

        search: z
            .string()
            .trim()
            .optional(),

        category: z
            .string()
            .trim()
            .optional(),

        minPrice: z
            .coerce
            .number()
            .min(
                0,
                "Minimum price cannot be negative"
            )
            .optional(),

        maxPrice: z
            .coerce
            .number()
            .min(
                0,
                "Maximum price cannot be negative"
            )
            .optional(),

        page: z
            .coerce
            .number()
            .int(
                "Page must be an integer"
            )
            .min(
                1,
                "Page must be at least 1"
            )
            .default(1),

        limit: z
            .coerce
            .number()
            .int(
                "Limit must be an integer"
            )
            .min(
                1,
                "Limit must be at least 1"
            )
            .max(
                100,
                "Limit cannot exceed 100"
            )
            .default(10)
    })

    // ========================================
    // CROSS-FIELD VALIDATION
    // ========================================

    .refine(
        (data) => {

            // If either price is missing,
            // there is nothing to compare.

            if (
                data.minPrice === undefined ||
                data.maxPrice === undefined
            ) {
                return true;
            }

            // minPrice must not be greater
            // than maxPrice.

            return data.minPrice <= data.maxPrice;
        },
        {
            message:
                "Minimum price cannot be greater than maximum price",

            path: ["minPrice"]
        }
    );


// ============================================
// GET ALL PRODUCTS
// ============================================

const getProductsSchema =
    z.object({

        body: z.object({}),

        params: z.object({}),

        query: getProductsQuerySchema

    });


// ============================================
// EXPORT
// ============================================

module.exports = {

    createProductSchema,

    updateProductSchema,

    getProductSchema,

    getProductsSchema

};