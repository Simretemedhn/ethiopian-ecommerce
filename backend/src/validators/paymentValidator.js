
const { z } = require("zod");
const mongoose = require("mongoose");

const orderIdSchema = z.string().refine(
    (id) => mongoose.isValidObjectId(id),
    "Invalid order ID"
);

const createPaymentSchema = z.object({
    body: z.object({
        orderId: orderIdSchema
    }),
    params: z.object({}),
    query: z.object({})
});

const getPaymentByOrderSchema = z.object({
    body: z.object({}),
    params: z.object({
        orderId: orderIdSchema
    }),
    query: z.object({})
});

const verifyPaymentSchema = z.object({
    body: z.object({}),
    params: z.object({
        txRef: z.string().trim().min(1).max(200)
    }),
    query: z.object({})
});

module.exports = {
    createPaymentSchema,
    getPaymentByOrderSchema,
    verifyPaymentSchema
};
