
const notificationService =
    require("../services/notificationService");

const getNotifications = async (req, res) => {
    const { page, limit } = req.validated.query;

    const result =
        await notificationService.getUserNotifications(
            req.user._id,
            page,
            limit
        );

    res.json(result);
};

const markNotificationAsRead = async (req, res) => {
    const notification =
        await notificationService.markNotificationAsRead(
            req.user._id,
            req.validated.params.notificationId
        );

    res.json({
        message: "Notification marked as read",
        notification
    });
};

const markAllNotificationsAsRead = async (req, res) => {
    const result =
        await notificationService.markAllNotificationsAsRead(
            req.user._id
        );

    res.json({
        message: "Notifications marked as read",
        modifiedCount: result.modifiedCount
    });
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};
