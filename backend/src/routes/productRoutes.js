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


const router =
    express.Router();


// ============================================
// GET ALL PRODUCTS
// ============================================

router.get(
    "/",
    asyncHandler(getProducts)
);


// ============================================
// GET ONE PRODUCT
// ============================================

router.get(
    "/:id",
    asyncHandler(getProductById)
);


// ============================================
// CREATE PRODUCT
// ============================================

router.post(
    "/",
    asyncHandler(createProduct)
);


// ============================================
// UPDATE PRODUCT
// ============================================

router.put(
    "/:id",
    asyncHandler(updateProduct)
);


// ============================================
// DELETE PRODUCT
// ============================================

router.delete(
    "/:id",
    asyncHandler(deleteProduct)
);


module.exports = router;