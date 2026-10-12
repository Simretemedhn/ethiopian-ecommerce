
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        // The order this payment attempt belongs to.
        // An order may have more than one attempt.
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        currency: {
            type: String,
            required: true,
            default: "ETB",
            uppercase: true,
            trim: true
        },

        // The gateway used by our application.
        provider: {
            type: String,
            enum: ["chapa"],
            required: true,
            default: "chapa"
        },

        // The actual method used by the customer, when
        // Chapa supplies this information.
        paymentMethod: {
            type: String,
            trim: true,
            lowercase: true,
            default: "unknown"
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

        // Our unique reference sent to Chapa.
        transactionReference: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        // URL returned by Chapa for hosted checkout.
        checkoutUrl: {
            type: String,
            trim: true
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

// Useful when retrieving payment attempts for an order.
paymentSchema.index({ order: 1, createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
