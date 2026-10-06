const express = require("express");

const {
    register,
    login,
    getCurrentUser
} = require("../controllers/authController");

const asyncHandler =
    require("../utils/asyncHandler");

const protect =
    require("../middleware/authMiddleware");

const validate =
    require("../middleware/validateMiddleware");

const {
    registerSchema,
    loginSchema
} = require("../validators/authValidator");

const router =
    express.Router();

router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(register)
);

router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(login)
);

router.get(
    "/me",
    protect,
    asyncHandler(getCurrentUser)
);

module.exports = router;