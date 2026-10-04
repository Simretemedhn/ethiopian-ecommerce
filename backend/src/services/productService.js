// Temporary in-memory product data.
const products = require("../data/products");


// ==================================================
// GET ALL PRODUCTS
// ==================================================

const getAllProducts = () => {

    return products;

};


// ==================================================
// GET ONE PRODUCT
// ==================================================

const getProductById = (id) => {

    return products.find(
        (product) => product.id === id
    );

};


// ==================================================
// CREATE PRODUCT
// ==================================================

const createProduct = (productData) => {

    // Create a new product object.
    const newProduct = {

        // Generate a simple ID for now.
        //
        // This is temporary.
        // MongoDB will eventually generate IDs for us.
        id: `p${Date.now()}`,

        // Copy the values sent by the client.
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category

    };


    // Add the new product to our array.
    products.push(newProduct);


    // Return the newly created product.
    return newProduct;

};

// ==================================================
// DELETE PRODUCT
// ==================================================

const deleteProduct = (id) => {

    // Find the position of the product.
    const index = products.findIndex(
        (product) => product.id === id
    );


    // If the product doesn't exist,
    // return null.
    if (index === -1) {

        return null;

    }


    // Remove one item from the array.
    //
    // splice(index, 1)
    //
    // means:
    //
    // start at "index"
    // remove 1 item
    //
    const deletedProduct = products.splice(index, 1);


    // splice() returns an array containing
    // the deleted item.
    //
    // [0] extracts that deleted product.
    //
    return deletedProduct[0];

};

// ==================================================
// UPDATE PRODUCT
// ==================================================

const updateProduct = (id, productData) => {

    // Find the product.
    const product = products.find(
        (product) => product.id === id
    );


    // If it doesn't exist...
    if (!product) {

        return null;

    }


    // Update its properties.
    product.name = productData.name;
    product.description = productData.description;
    product.price = productData.price;
    product.category = productData.category;


    // Return the updated product.
    return product;

};
// Export our services.
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct
};
