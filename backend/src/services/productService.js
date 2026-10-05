const products = require("../data/products");
const ApiError = require("../utils/ApiError");

// ============================================
// GET ALL PRODUCTS
// ============================================

const getAllProducts = (filters = {}) => {

    // Create a copy of the original products array.
    let result = [...products];

    // ----------------------------------------
    // SEARCH BY NAME
    // ----------------------------------------

    if (filters.search) {

        result = result.filter((product) =>
            product.name
                .toLowerCase()
                .includes(filters.search.toLowerCase())
        );
    }

    // ----------------------------------------
    // FILTER BY CATEGORY
    // ----------------------------------------

    if (filters.category) {

        result = result.filter(
            (product) =>
                product.category.toLowerCase() ===
                filters.category.toLowerCase()
        );
    }

    // ----------------------------------------
    // MINIMUM PRICE
    // ----------------------------------------

    if (filters.minPrice !== undefined) {

        result = result.filter(
            (product) =>
                product.price >= filters.minPrice
        );
    }

    // ----------------------------------------
    // MAXIMUM PRICE
    // ----------------------------------------

    if (filters.maxPrice !== undefined) {

        result = result.filter(
            (product) =>
                product.price <= filters.maxPrice
        );
    }

    // ----------------------------------------
    // PAGINATION
    // ----------------------------------------

    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const startIndex =
        (page - 1) * limit;

    const paginatedProducts =
        result.slice(
            startIndex,
            startIndex + limit
        );

    return {
        products: paginatedProducts,

        pagination: {
            page,
            limit,
            totalProducts: result.length,
            totalPages: Math.ceil(
                result.length / limit
            )
        }
    };
};


// ============================================
// GET PRODUCT BY ID
// ============================================

const getProductById = (id) => {

    return products.find(
        (product) => product.id === id
    );
};


// ============================================
// CREATE PRODUCT
// ============================================

const createProduct = (productData) => {

    const newProduct = {

        id: `p${Date.now()}`,

        name: productData.name,

        description: productData.description,

        price: productData.price,

        category: productData.category
    };

    products.push(newProduct);

    return newProduct;
};


// ============================================
// DELETE PRODUCT
// ============================================

const deleteProduct = (id) => {

    const index = products.findIndex(
        (product) => product.id === id
    );

    if (index === -1) {
        return null;
    }

    const deletedProduct =
        products.splice(index, 1);

    return deletedProduct[0];
};


// ============================================
// UPDATE PRODUCT
// ============================================

const updateProduct = (id, productData) => {

    const product = products.find(
        (product) => product.id === id
    );

    if (!product) {
        return null;
    }

    product.name =
        productData.name;

    product.description =
        productData.description;

    product.price =
        productData.price;

    product.category =
        productData.category;

    return product;
};


// ============================================
// EXPORT FUNCTIONS
// ============================================

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct
};