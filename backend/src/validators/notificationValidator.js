
const { z } = require("zod");
const mongoose = require("mongoose");

const listNotificationsSchema = z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({
        page: z.coerce.number()
            .int()
            .min(1)
            .default(1),

        limit: z.coerce.number()
            .int()
            .min(1)
            .max(100)
            .default(20)
    })
});

const notificationIdSchema = z.string().refine(
    (id) => mongoose.isValidObjectId(id),
    "Invalid notification ID"
);

const markNotificationReadSchema = z.object({
    body: z.object({}),
    params: z.object({
        notificationId: notificationIdSchema
    }),
    query: z.object({})
});

const markAllNotificationsReadSchema = z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({})
});

module.exports = {
    listNotificationsSchema,
    markNotificationReadSchema,
    markAllNotificationsReadSchema
};
