const orderService =
    require("../services/orderService");


// ============================================
// CREATE ORDER
// ============================================

const createOrder = async (
    req,
    res
) => {

    const order =
        await orderService.createOrder(
            req.user._id
        );


    res.status(201).json(
        order
    );
};


// ============================================
// GET MY ORDERS
// ============================================

const getMyOrders = async (
    req,
    res
) => {

    const orders =
        await orderService.getUserOrders(
            req.user._id
        );


    res.json({
        orders
    });
};


// ============================================
// GET ONE ORDER
// ============================================

const getOrderById = async (
    req,
    res
) => {

    const order =
        await orderService.getOrderById(
            req.user._id,
            req.validated.params.id
        );


    res.json(
        order
    );
};


// ============================================
// UPDATE ORDER STATUS
// ============================================

const updateOrderStatus = async (
    req,
    res
) => {

    const order =
        await orderService.updateOrderStatus(
            req.validated.params.id,
            req.validated.body.status
        );


    res.json(
        order
    );
};


// ============================================
// EXPORT
// ============================================

module.exports = {

    createOrder,

    getMyOrders,

    getOrderById,

    updateOrderStatus

};