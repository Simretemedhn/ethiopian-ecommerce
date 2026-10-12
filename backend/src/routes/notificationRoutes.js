
const express = require("express");

const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const {
    listNotificationsSchema,
    markNotificationReadSchema,
    markAllNotificationsReadSchema
} = require("../validators/notificationValidator");

const router = express.Router();

// Every notification endpoint requires authentication.
router.use(protect);

// GET /api/notifications?page=1&limit=20
router.get(
    "/",
    validate(listNotificationsSchema),
    asyncHandler(getNotifications)
);

// PATCH /api/notifications/read-all
router.patch(
    "/read-all",
    validate(markAllNotificationsReadSchema),
    asyncHandler(markAllNotificationsAsRead)
);

// PATCH /api/notifications/:notificationId/read
router.patch(
    "/:notificationId/read",
    validate(markNotificationReadSchema),
    asyncHandler(markNotificationAsRead)
);

module.exports = router;
