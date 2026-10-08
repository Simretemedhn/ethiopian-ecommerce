const { z } = require("zod");
const mongoose = require("mongoose");


// ============================================
// PRODUCT ID VALIDATOR
// ============================================

const productIdSchema =
    z
        .string()
        .refine(
            (id) =>
                mongoose.isValidObjectId(id),
            "Invalid product ID"
        );


// ============================================
// QUANTITY VALIDATOR
// ============================================

const quantitySchema =
    z
        .coerce
        .number()
        .int(
            "Quantity must be an integer"
        )
        .min(
            1,
            "Quantity must be at least 1"
        )
        .max(
            99,
            "Quantity cannot exceed 99"
        );


// ============================================
// ADD ITEM
// ============================================

const addCartItemSchema =
    z.object({

        body: z.object({

            productId:
                productIdSchema,

            quantity:
                quantitySchema
        }),

        params: z.object({}),

        query: z.object({})
    });


// ============================================
// UPDATE ITEM
// ============================================

const updateCartItemSchema =
    z.object({

        body: z.object({

            quantity:
                quantitySchema
        }),

        params: z.object({

            productId:
                productIdSchema
        }),

        query: z.object({})
    });


// ============================================
// REMOVE ITEM
// ============================================

const removeCartItemSchema =
    z.object({

        body: z.object({}),

        params: z.object({

            productId:
                productIdSchema
        }),

        query: z.object({})
    });


// ============================================
// EXPORT
// ============================================

module.exports = {

    addCartItemSchema,

    updateCartItemSchema,

    removeCartItemSchema

};