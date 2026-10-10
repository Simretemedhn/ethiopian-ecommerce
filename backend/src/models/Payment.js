const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        currency: {
            type: String,
            required: true,
            default: "ETB",
            uppercase: true,
            trim: true
        },

        provider: {
            type: String,
            enum: ["chapa"],
            required: true,
            default: "chapa"
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "completed",
                "failed",
                "refunded"
            ],
            default: "pending"
        },

        transactionReference: {
            type: String,
            trim: true,
            unique: true,
            sparse: true
        },

        failureReason: {
            type: String,
            trim: true
        },

        paidAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model(
    "Payment",
    paymentSchema
);

module.exports = Payment;