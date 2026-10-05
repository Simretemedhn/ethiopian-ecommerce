const productService =
    require("../services/productService");

const ApiError =
    require("../utils/ApiError");


// ============================================
// GET ALL PRODUCTS
// ============================================

const getProducts = async (req, res) => {

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
        await productService.getAllProducts(
            filters
        );


    res.json(result);
};


// ============================================
// GET ONE PRODUCT
// ============================================

const getProductById = async (
    req,
    res
) => {

    const product =
        await productService.getProductById(
            req.params.id
        );


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

const createProduct = async (
    req,
    res
) => {

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
        await productService.createProduct(
            productData
        );


    res.status(201).json(
        newProduct
    );
};


// ============================================
// UPDATE PRODUCT
// ============================================

const updateProduct = async (
    req,
    res
) => {

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
        await productService.updateProduct(
            req.params.id,
            productData
        );


    if (!updatedProduct) {

        throw new ApiError(
            404,
            "Product not found"
        );
    }


    res.json(
        updatedProduct
    );
};


// ============================================
// DELETE PRODUCT
// ============================================

const deleteProduct = async (
    req,
    res
) => {

    const deletedProduct =
        await productService.deleteProduct(
            req.params.id
        );


    if (!deletedProduct) {

        throw new ApiError(
            404,
            "Product not found"
        );
    }


    res.json({

        message:
            "Product deleted successfully",

        product:
            deletedProduct
    });
};


// ============================================
// EXPORT
// ============================================

module.exports = {

    getProducts,

    getProductById,

    createProduct,

    updateProduct,

    deleteProduct
};