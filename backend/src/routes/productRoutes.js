const express = require("express");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const asyncHandler =
    require("../utils/asyncHandler");

const protect =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const validate =
    require("../middleware/validateMiddleware");

const {
    createProductSchema,
    updateProductSchema,
    getProductSchema,
    getProductsSchema
} = require("../validators/productValidator");

const router =
    express.Router();


// ============================================
// PUBLIC PRODUCT ROUTES
// ============================================

// GET ALL PRODUCTS
router.get(
    "/",
    validate(getProductsSchema),
    asyncHandler(getProducts)
);


// GET ONE PRODUCT
router.get(
    "/:id",
    validate(getProductSchema),
    asyncHandler(getProductById)
);


// ============================================
// ADMIN PRODUCT ROUTES
// ============================================

// CREATE PRODUCT
router.post(
    "/",
    protect,
    authorizeRoles("admin", "superadmin"),
    validate(createProductSchema),
    asyncHandler(createProduct)
);


// UPDATE PRODUCT
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "superadmin"),
    validate(updateProductSchema),
    asyncHandler(updateProduct)
);


// DELETE PRODUCT
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "superadmin"),
    validate(getProductSchema),
    asyncHandler(deleteProduct)
);


module.exports = router;