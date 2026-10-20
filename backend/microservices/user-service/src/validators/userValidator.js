const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID");
const roles = ["customer", "admin", "superadmin"];

const listUsersSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    role: z.enum(roles).optional(),
    search: z.string().trim().max(100).optional(),
  }),
});
const userIdSchema = z.object({ body: z.object({}), params: z.object({ id: objectIdSchema }), query: z.object({}) });
const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().toLowerCase().email(),
  }),
  params: z.object({ id: objectIdSchema }),
  query: z.object({}),
});
const updateRoleSchema = z.object({ body: z.object({ role: z.enum(roles) }), params: z.object({ id: objectIdSchema }), query: z.object({}) });
const updateStatusSchema = z.object({ body: z.object({ isActive: z.boolean() }), params: z.object({ id: objectIdSchema }), query: z.object({}) });

module.exports = { listUsersSchema, userIdSchema, updateUserSchema, updateRoleSchema, updateStatusSchema };
