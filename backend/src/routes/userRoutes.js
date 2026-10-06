const express = require("express");

const {
    getUsers,
    getUserById,
    updateUser,
    updateUserRole,
    updateUserStatus
} = require("../controllers/userController");

const asyncHandler =
    require("../utils/asyncHandler");

const protect =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const router =
    express.Router();

/*
    All user-management routes require authentication.
*/
router.use(protect);

/*
    Admins and superadmins can view users.
*/
router.get(
    "/",
    authorizeRoles(
        "admin",
        "superadmin"
    ),
    asyncHandler(getUsers)
);

router.get(
    "/:id",
    authorizeRoles(
        "admin",
        "superadmin"
    ),
    asyncHandler(getUserById)
);

/*
    Admins and superadmins can update
    basic user information.
*/
router.patch(
    "/:id",
    authorizeRoles(
        "admin",
        "superadmin"
    ),
    asyncHandler(updateUser)
);

/*
    Only superadmins can change roles.
*/
router.patch(
    "/:id/role",
    authorizeRoles(
        "superadmin"
    ),
    asyncHandler(updateUserRole)
);

/*
    Only superadmins can enable/disable users.
*/
router.patch(
    "/:id/status",
    authorizeRoles(
        "superadmin"
    ),
    asyncHandler(updateUserStatus)
);

module.exports = router;