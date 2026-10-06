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
    getProductSchema
} = require("../validators/productValidator");

const router =
    express.Router();

// PUBLIC

router.get(
    "/",
    asyncHandler(getProducts)
);

router.get(
    "/:id",
    validate(getProductSchema),
    asyncHandler(getProductById)
);

// ADMIN

router.post(
    "/",
    protect,
    authorizeRoles("admin", "superadmin"),
    validate(createProductSchema),
    asyncHandler(createProduct)
);

router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "superadmin"),
    validate(updateProductSchema),
    asyncHandler(updateProduct)
);

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "superadmin"),
    validate(getProductSchema),
    asyncHandler(deleteProduct)
);

module.exports = router;