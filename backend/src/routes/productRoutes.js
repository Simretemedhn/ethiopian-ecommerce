// Import Express.
const express = require("express");


// Import product controllers.
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");


// Create router.
const router = express.Router();


// ==================================================
// GET ALL PRODUCTS
// ==================================================

router.get("/", getProducts);


// ==================================================
// GET ONE PRODUCT
// ==================================================

router.get("/:id", getProductById);


// ==================================================
// CREATE PRODUCT
// ==================================================

router.post("/", createProduct);


// ==================================================
// UPDATE PRODUCT
// ==================================================

router.put("/:id", updateProduct);


// ==================================================
// DELETE PRODUCT
// ==================================================

router.delete("/:id", deleteProduct);


// Export router.
module.exports = router;