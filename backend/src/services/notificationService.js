
const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");

// Used internally by other backend services.
// Do not expose this as a public endpoint that lets
// customers create arbitrary notifications.
const createNotification = async ({
    recipient,
    type,
    title,
    message,
    data = {}
}) => {
    return Notification.create({
        recipient,
        type,
        title,
        message,
        data
    });
};

const getUserNotifications = async (
    userId,
    page = 1,
    limit = 20
) => {
    const skip = (page - 1) * limit;

    const [notifications, total, unread] =
        await Promise.all([
            Notification.find({
                recipient: userId
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Notification.countDocuments({
                recipient: userId
            }),

            Notification.countDocuments({
                recipient: userId,
                readAt: null
            })
        ]);

    return {
        notifications,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        },
        unreadCount: unread
    };
};

const markNotificationAsRead = async (
    userId,
    notificationId
) => {
    // Filter by BOTH notification ID and recipient.
    // This prevents a user from marking another user's
    // notification as read.
    const notification =
        await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                recipient: userId
            },
            {
                $set: {
                    readAt: new Date()
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    return notification;
};

const markAllNotificationsAsRead = async (userId) => {
    const result = await Notification.updateMany(
        {
            recipient: userId,
            readAt: null
        },
        {
            $set: {
                readAt: new Date()
            }
        }
    );

    return {
        modifiedCount: result.modifiedCount
    };
};

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};
