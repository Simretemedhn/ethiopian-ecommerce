const Product = require("../models/Product");


// ============================================
// GET ALL PRODUCTS
// ============================================

const getAllProducts = async (filters = {}) => {

    const query = {};


    // ----------------------------------------
    // SEARCH BY NAME
    // ----------------------------------------

    if (filters.search) {

        query.name = {
            $regex: filters.search,
            $options: "i"
        };
    }


    // ----------------------------------------
    // FILTER BY CATEGORY
    // ----------------------------------------

    if (filters.category) {

        query.category = {
            $regex: `^${filters.category}$`,
            $options: "i"
        };
    }


    // ----------------------------------------
    // FILTER BY PRICE
    // ----------------------------------------

    if (
        filters.minPrice !== undefined ||
        filters.maxPrice !== undefined
    ) {

        query.price = {};

        if (filters.minPrice !== undefined) {

            query.price.$gte =
                filters.minPrice;
        }

        if (filters.maxPrice !== undefined) {

            query.price.$lte =
                filters.maxPrice;
        }
    }


    // ----------------------------------------
    // PAGINATION
    // ----------------------------------------

    const page =
        filters.page || 1;

    const limit =
        filters.limit || 10;

    const skip =
        (page - 1) * limit;


    // ----------------------------------------
    // QUERY MONGODB
    // ----------------------------------------

    const products =
        await Product
            .find(query)
            .skip(skip)
            .limit(limit);


    // ----------------------------------------
    // COUNT MATCHING DOCUMENTS
    // ----------------------------------------

    const totalProducts =
        await Product.countDocuments(query);


    // ----------------------------------------
    // RETURN RESULT
    // ----------------------------------------

    return {

        products,

        pagination: {

            page,

            limit,

            totalProducts,

            totalPages:
                Math.ceil(
                    totalProducts / limit
                )
        }
    };
};


// ============================================
// GET PRODUCT BY ID
// ============================================

const getProductById = async (id) => {

    return await Product.findById(id);
};


// ============================================
// CREATE PRODUCT
// ============================================

const createProduct = async (productData) => {

    return await Product.create(
        productData
    );
};


// ============================================
// UPDATE PRODUCT
// ============================================

const updateProduct = async (
    id,
    productData
) => {

    return await Product.findByIdAndUpdate(
        id,
        productData,
        {
            new: true,
            runValidators: true
        }
    );
};


// ============================================
// DELETE PRODUCT
// ============================================

const deleteProduct = async (id) => {

    return await Product.findByIdAndDelete(id);
};


// ============================================
// EXPORT
// ============================================

module.exports = {

    getAllProducts,

    getProductById,

    createProduct,

    updateProduct,

    deleteProduct
};