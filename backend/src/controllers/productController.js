const productService = require("../services/productService");


// ==================================================
// GET ALL PRODUCTS
// ==================================================

const getProducts = (req, res) => {

    const products = productService.getAllProducts();

    res.json(products);

};


// ==================================================
// GET ONE PRODUCT
// ==================================================

const getProductById = (req, res) => {

    const productId = req.params.id;

    const product = productService.getProductById(productId);


    if (!product) {

        return res.status(404).json({
            message: "Product not found"
        });

    }


    res.json(product);

};


// ==================================================
// CREATE PRODUCT
// ==================================================

const createProduct = (req, res) => {

    // Get request body.
    const productData = req.body;


    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    // Check that required fields exist.
    if (
        !productData.name ||
        !productData.description ||
        !productData.price ||
        !productData.category
    ) {

        return res.status(400).json({
            message: "Name, description, price, and category are required"
        });

    }


    // Check that price is a positive number.
    if (
        typeof productData.price !== "number" ||
        productData.price <= 0
    ) {

        return res.status(400).json({
            message: "Price must be a positive number"
        });

    }


    // ----------------------------------------------
    // CREATE PRODUCT
    // ----------------------------------------------

    const newProduct =
        productService.createProduct(productData);


    // Return created product.
    res.status(201).json(newProduct);

};

// ==================================================
// DELETE PRODUCT
// ==================================================

const deleteProduct = (req, res) => {

    // Get product ID from URL.
    const productId = req.params.id;


    // Ask service to delete it.
    const deletedProduct =
        productService.deleteProduct(productId);


    // If product doesn't exist...
    if (!deletedProduct) {

        return res.status(404).json({
            message: "Product not found"
        });

    }


    // Return a success response.
    res.status(200).json({
        message: "Product deleted successfully",
        product: deletedProduct
    });

};

// ==================================================
// UPDATE PRODUCT
// ==================================================

const updateProduct = (req, res) => {

    // Get ID from URL.
    const productId = req.params.id;


    // Get new product data from request body.
    const productData = req.body;


    // Basic validation.
    if (
        !productData.name ||
        !productData.description ||
        !productData.price ||
        !productData.category
    ) {

        return res.status(400).json({
            message: "Name, description, price, and category are required"
        });

    }


    // Ask service to update product.
    const updatedProduct =
        productService.updateProduct(
            productId,
            productData
        );


    // Product doesn't exist.
    if (!updatedProduct) {

        return res.status(404).json({
            message: "Product not found"
        });

    }


    // Send updated product.
    res.status(200).json(updatedProduct);

};
// Export controllers.
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    createProduct,
    updateProduct,
    deleteProduct
};