const express = require("express");
const { getUsers, getUserById, updateUser, updateUserRole, updateUserStatus } = require("../controllers/userController");
const asyncHandler = require("../utils/asyncHandler");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { listUsersSchema, userIdSchema, updateUserSchema, updateRoleSchema, updateStatusSchema } = require("../validators/userValidator");

const router = express.Router();
router.use(protect);
router.get("/", authorizeRoles("admin", "superadmin"), validate(listUsersSchema), asyncHandler(getUsers));
router.get("/:id", authorizeRoles("admin", "superadmin"), validate(userIdSchema), asyncHandler(getUserById));
router.patch("/:id", authorizeRoles("admin", "superadmin"), validate(updateUserSchema), asyncHandler(updateUser));
router.patch("/:id/role", authorizeRoles("superadmin"), validate(updateRoleSchema), asyncHandler(updateUserRole));
router.patch("/:id/status", authorizeRoles("superadmin"), validate(updateStatusSchema), asyncHandler(updateUserStatus));

module.exports = router;
