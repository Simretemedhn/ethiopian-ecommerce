const productService =
    require("../services/productService");

const ApiError =
    require("../utils/ApiError");


// ============================================
// GET ALL PRODUCTS
// ============================================

const getProducts = (req, res) => {

    const filters = {

        search: req.query.search,

        category: req.query.category,

        minPrice:
            req.query.minPrice !== undefined
                ? Number(req.query.minPrice)
                : undefined,

        maxPrice:
            req.query.maxPrice !== undefined
                ? Number(req.query.maxPrice)
                : undefined,

        page:
            req.query.page !== undefined
                ? Number(req.query.page)
                : 1,

        limit:
            req.query.limit !== undefined
                ? Number(req.query.limit)
                : 10
    };

    const result =
        productService.getAllProducts(filters);

    res.json(result);
};


// ============================================
// GET ONE PRODUCT
// ============================================

const getProductById = (req, res) => {

    const productId =
        req.params.id;

    const product =
        productService.getProductById(productId);

    if (!product) {

        throw new ApiError(
            404,
            "Product not found"
        );
    }

    res.json(product);
};


// ============================================
// CREATE PRODUCT
// ============================================

const createProduct = (req, res) => {

    const productData = req.body;

    if (
        !productData.name ||
        !productData.description ||
        !productData.price ||
        !productData.category
    ) {

        throw new ApiError(
            400,
            "Name, description, price, and category are required"
        );
    }

    if (
        typeof productData.price !== "number" ||
        productData.price <= 0
    ) {

        throw new ApiError(
            400,
            "Price must be a positive number"
        );
    }

    const newProduct =
        productService.createProduct(
            productData
        );

    res.status(201).json(newProduct);
};


// ============================================
// UPDATE PRODUCT
// ============================================

const updateProduct = (req, res) => {

    const productId =
        req.params.id;

    const productData =
        req.body;

    if (
        !productData.name ||
        !productData.description ||
        !productData.price ||
        !productData.category
    ) {

        throw new ApiError(
            400,
            "Name, description, price, and category are required"
        );
    } 

    const updatedProduct =
        productService.updateProduct(
            productId,
            productData
        );

    if (!updatedProduct) {

        throw new ApiError(
            404,
            "Product not found"
        );
    }

    res.status(200).json(
        updatedProduct
    );
};


// ============================================
// DELETE PRODUCT
// ============================================

const deleteProduct = (req, res) => {

    const productId =
        req.params.id;

    const deletedProduct =
        productService.deleteProduct(
            productId
        );

    if (!deletedProduct) {

        throw new ApiError(
            404,
            "Product not found"
        );
    }

    res.status(200).json({

        message:
            "Product deleted successfully",

        product:
            deletedProduct
    });
};


// ============================================
// EXPORT CONTROLLERS
// ============================================

module.exports = {

    getProducts,

    getProductById,

    createProduct,

    updateProduct,

    deleteProduct
};