const Cart =
    require("../models/Cart");

const Product =
    require("../models/Product");

const ApiError =
    require("../utils/ApiError");


// ============================================
// GET USER CART
// ============================================

const getCart = async (
    userId
) => {

    let cart =
        await Cart
            .findOne({
                user: userId
            })
            .populate(
                "items.product"
            );


    // ----------------------------------------
    // CREATE EMPTY CART IF NONE EXISTS
    // ----------------------------------------

    if (!cart) {

        cart =
            await Cart.create({
                user: userId,
                items: []
            });
    }


    // ----------------------------------------
    // CALCULATE TOTAL
    // ----------------------------------------

    let total = 0;


    for (
        const item of cart.items
    ) {

        if (!item.product) {
            continue;
        }


        total +=
            item.product.price *
            item.quantity;
    }


    // ----------------------------------------
    // RETURN CART
    // ----------------------------------------

    return {

        cart,

        total
    };
};


// ============================================
// ADD ITEM TO CART
// ============================================

const addItem = async (
    userId,
    productId,
    quantity
) => {

    // ----------------------------------------
    // FIND PRODUCT
    // ----------------------------------------

    const product =
        await Product.findById(
            productId
        );


    if (!product) {

        throw new ApiError(
            404,
            "Product not found"
        );
    }


    // ----------------------------------------
    // FIND USER CART
    // ----------------------------------------

    let cart =
        await Cart.findOne({
            user: userId
        });


    // ----------------------------------------
    // CREATE CART IF NECESSARY
    // ----------------------------------------

    if (!cart) {

        cart =
            await Cart.create({

                user: userId,

                items: [
                    {
                        product:
                            productId,

                        quantity
                    }
                ]
            });


        return await getCart(
            userId
        );
    }


    // ----------------------------------------
    // CHECK WHETHER PRODUCT ALREADY EXISTS
    // ----------------------------------------

    const existingItem =
        cart.items.find(
            (item) =>
                item.product.toString() ===
                productId.toString()
        );


    // ----------------------------------------
    // PRODUCT ALREADY EXISTS
    // ----------------------------------------

    if (existingItem) {

        const newQuantity =
            existingItem.quantity +
            quantity;


        if (newQuantity > 99) {

            throw new ApiError(
                400,
                "Cart item quantity cannot exceed 99"
            );
        }


        existingItem.quantity =
            newQuantity;
    }


    // ----------------------------------------
    // NEW PRODUCT
    // ----------------------------------------

    else {

        cart.items.push({

            product:
                productId,

            quantity
        });
    }


    // ----------------------------------------
    // SAVE CART
    // ----------------------------------------

    await cart.save();


    // ----------------------------------------
    // RETURN UPDATED CART
    // ----------------------------------------

    return await getCart(
        userId
    );
};


// ============================================
// UPDATE CART ITEM
// ============================================

const updateItem = async (
    userId,
    productId,
    quantity
) => {

    const cart =
        await Cart.findOne({
            user: userId
        });


    if (!cart) {

        throw new ApiError(
            404,
            "Cart not found"
        );
    }


    // ----------------------------------------
    // FIND ITEM
    // ----------------------------------------

    const item =
        cart.items.find(
            (item) =>
                item.product.toString() ===
                productId.toString()
        );


    if (!item) {

        throw new ApiError(
            404,
            "Product is not in your cart"
        );
    }


    // ----------------------------------------
    // UPDATE QUANTITY
    // ----------------------------------------

    item.quantity =
        quantity;


    // ----------------------------------------
    // SAVE
    // ----------------------------------------

    await cart.save();


    // ----------------------------------------
    // RETURN UPDATED CART
    // ----------------------------------------

    return await getCart(
        userId
    );
};


// ============================================
// REMOVE ITEM FROM CART
// ============================================

const removeItem = async (
    userId,
    productId
) => {

    const cart =
        await Cart.findOne({
            user: userId
        });


    if (!cart) {

        throw new ApiError(
            404,
            "Cart not found"
        );
    }


    // ----------------------------------------
    // CHECK WHETHER ITEM EXISTS
    // ----------------------------------------

    const itemExists =
        cart.items.some(
            (item) =>
                item.product.toString() ===
                productId.toString()
        );


    if (!itemExists) {

        throw new ApiError(
            404,
            "Product is not in your cart"
        );
    }


    // ----------------------------------------
    // REMOVE ITEM
    // ----------------------------------------

    cart.items =
        cart.items.filter(
            (item) =>
                item.product.toString() !==
                productId.toString()
        );


    // ----------------------------------------
    // SAVE CART
    // ----------------------------------------

    await cart.save();


    // ----------------------------------------
    // RETURN UPDATED CART
    // ----------------------------------------

    return await getCart(
        userId
    );
};


// ============================================
// CLEAR CART
// ============================================

const clearCart = async (
    userId
) => {

    const cart =
        await Cart.findOne({
            user: userId
        });


    if (!cart) {

        throw new ApiError(
            404,
            "Cart not found"
        );
    }


    cart.items = [];


    await cart.save();


    return await getCart(
        userId
    );
};


// ============================================
// EXPORT
// ============================================

module.exports = {

    getCart,

    addItem,

    updateItem,

    removeItem,

    clearCart

};