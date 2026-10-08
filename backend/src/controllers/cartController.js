const cartService =
    require("../services/cartService");


// ============================================
// GET CART
// ============================================

const getCart = async (
    req,
    res
) => {

    const result =
        await cartService.getCart(
            req.user._id
        );


    res.json(result);
};


// ============================================
// ADD ITEM
// ============================================

const addItem = async (
    req,
    res
) => {

    const {
        productId,
        quantity
    } =
        req.validated.body;


    const result =
        await cartService.addItem(
            req.user._id,
            productId,
            quantity
        );


    res.status(200).json(
        result
    );
};


// ============================================
// UPDATE ITEM
// ============================================

const updateItem = async (
    req,
    res
) => {

    const {
        productId
    } =
        req.validated.params;


    const {
        quantity
    } =
        req.validated.body;


    const result =
        await cartService.updateItem(
            req.user._id,
            productId,
            quantity
        );


    res.json(result);
};


// ============================================
// REMOVE ITEM
// ============================================

const removeItem = async (
    req,
    res
) => {

    const {
        productId
    } =
        req.validated.params;


    const result =
        await cartService.removeItem(
            req.user._id,
            productId
        );


    res.json(result);
};


// ============================================
// CLEAR CART
// ============================================

const clearCart = async (
    req,
    res
) => {

    const result =
        await cartService.clearCart(
            req.user._id
        );


    res.json(result);
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