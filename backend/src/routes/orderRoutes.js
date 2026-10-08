const express =
    require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} =
    require("../controllers/orderController");

const asyncHandler =
    require("../utils/asyncHandler");

const protect =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const validate =
    require("../middleware/validateMiddleware");

const {
    createOrderSchema,
    getOrderSchema,
    updateOrderStatusSchema
} =
    require("../validators/orderValidator");


const router =
    express.Router();


// ============================================
// ALL ORDER ROUTES REQUIRE LOGIN
// ============================================

router.use(
    protect
);


// ============================================
// CREATE ORDER
// ============================================

router.post(
    "/",
    validate(createOrderSchema),
    asyncHandler(createOrder)
);


// ============================================
// GET MY ORDERS
// ============================================

router.get(
    "/",
    asyncHandler(getMyOrders)
);


// ============================================
// GET ONE ORDER
// ============================================

router.get(
    "/:id",
    validate(getOrderSchema),
    asyncHandler(getOrderById)
);


// ============================================
// ADMIN ORDER STATUS UPDATE
// ============================================

router.patch(
    "/:id/status",
    authorizeRoles(
        "admin",
        "superadmin"
    ),
    validate(
        updateOrderStatusSchema
    ),
    asyncHandler(
        updateOrderStatus
    )
);


module.exports =
    router;