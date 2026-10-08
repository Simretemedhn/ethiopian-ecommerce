const productService =
    require("../services/productService");

const ApiError =
    require("../utils/ApiError");


// ============================================
// GET ALL PRODUCTS
// ============================================

const getProducts = async (
    req,
    res
) => {

    const filters =
        req.validated.query;


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

    const { id } =
        req.validated.params;


    const product =
        await productService.getProductById(
            id
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
        req.validated.body;


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
        req.validated.body;

    const { id } =
        req.validated.params;


    const updatedProduct =
        await productService.updateProduct(
            id,
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

    const { id } =
        req.validated.params;


    const deletedProduct =
        await productService.deleteProduct(
            id
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