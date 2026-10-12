
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        // The user who owns this notification.
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Helps the frontend decide how to display it.
        type: {
            type: String,
            enum: [
                "order_created",
                "order_status",
                "payment_success",
                "payment_failed",
                "system"
            ],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        // Optional context, such as an order ID.
        // This is not a replacement for authorization checks.
        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        // null means the user has not read the notification.
        readAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Efficiently retrieve a user's newest notifications.
notificationSchema.index({
    recipient: 1,
    createdAt: -1
});

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

module.exports = Notification;
