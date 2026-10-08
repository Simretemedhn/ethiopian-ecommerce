const express =
    require("express");

const {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart
} =
    require("../controllers/cartController");

const asyncHandler =
    require("../utils/asyncHandler");

const protect =
    require("../middleware/authMiddleware");

const validate =
    require("../middleware/validateMiddleware");

const {
    addCartItemSchema,
    updateCartItemSchema,
    removeCartItemSchema
} =
    require("../validators/cartValidator");


const router =
    express.Router();


// ============================================
// ALL CART ROUTES REQUIRE AUTHENTICATION
// ============================================

router.use(
    protect
);


// ============================================
// GET CURRENT USER CART
// ============================================

router.get(
    "/",
    asyncHandler(getCart)
);


// ============================================
// ADD PRODUCT TO CART
// ============================================

router.post(
    "/items",
    validate(addCartItemSchema),
    asyncHandler(addItem)
);


// ============================================
// UPDATE CART ITEM
// ============================================

router.patch(
    "/items/:productId",
    validate(updateCartItemSchema),
    asyncHandler(updateItem)
);


// ============================================
// REMOVE CART ITEM
// ============================================

router.delete(
    "/items/:productId",
    validate(removeCartItemSchema),
    asyncHandler(removeItem)
);


// ============================================
// CLEAR CART
// ============================================

router.delete(
    "/",
    asyncHandler(clearCart)
);


module.exports =
    router;