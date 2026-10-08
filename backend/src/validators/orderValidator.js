const { z } =
    require("zod");

const mongoose =
    require("mongoose");


// ============================================
// ORDER ID VALIDATOR
// ============================================

const orderIdSchema =
    z
        .string()
        .refine(
            (id) =>
                mongoose.isValidObjectId(id),

            "Invalid order ID"
        );


// ============================================
// ORDER STATUS VALIDATOR
// ============================================

const orderStatusSchema =
    z.enum(
        [
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ],
        {
            message:
                "Invalid order status"
        }
    );


// ============================================
// CREATE ORDER
// ============================================

const createOrderSchema =
    z.object({

        body: z.object({}),

        params: z.object({}),

        query: z.object({})
    });


// ============================================
// GET ONE ORDER
// ============================================

const getOrderSchema =
    z.object({

        body: z.object({}),

        params: z.object({

            id:
                orderIdSchema
        }),

        query: z.object({})
    });


// ============================================
// UPDATE ORDER STATUS
// ============================================

const updateOrderStatusSchema =
    z.object({

        body: z.object({

            status:
                orderStatusSchema
        }),

        params: z.object({

            id:
                orderIdSchema
        }),

        query: z.object({})
    });


// ============================================
// EXPORT
// ============================================

module.exports = {

    createOrderSchema,

    getOrderSchema,

    updateOrderStatusSchema

};