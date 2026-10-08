const Order =
    require("../models/Order");

const Cart =
    require("../models/Cart");

const Product =
    require("../models/Product");

const ApiError =
    require("../utils/ApiError");


// ============================================
// CREATE ORDER FROM CART
// ============================================

const createOrder = async ( 
    userId
) => {
      
    // ----------------------------------------
    // FIND USER CART
    // ----------------------------------------

    const cart =
        await Cart
            .findOne({
                user: userId
            })
            .populate(
                "items.product"
            );


    if (!cart) {

        throw new ApiError(
            400,
            "Your cart is empty"
        );
    }


    // ----------------------------------------
    // CHECK CART ITEMS
    // ----------------------------------------

    if (
        !cart.items ||
        cart.items.length === 0
    ) {

        throw new ApiError(
            400,
            "Your cart is empty"
        );
    }


    // ----------------------------------------
    // BUILD ORDER ITEMS
    // ----------------------------------------

    const orderItems = [];


    let subtotal = 0;


    for (
        const cartItem of cart.items
    ) {

        // ------------------------------------
        // PRODUCT MUST EXIST
        // ------------------------------------

        if (!cartItem.product) {

            throw new ApiError(
                400,
                "A product in your cart no longer exists"
            );
        }


        const product =
            cartItem.product;


        // ------------------------------------
        // CREATE PRICE SNAPSHOT
        // ------------------------------------

        const orderItem = {

            product:
                product._id,

            name:
                product.name,

            price:
                product.price,

            quantity:
                cartItem.quantity
        };


        // ------------------------------------
        // CALCULATE ITEM TOTAL
        // ------------------------------------

        subtotal +=
            product.price *
            cartItem.quantity;


        orderItems.push(
            orderItem
        );
    }


    // ----------------------------------------
    // CREATE ORDER
    // ----------------------------------------

    const order =
        await Order.create({

            user:
                userId,

            items:
                orderItems,

            subtotal,

            status:
                "pending",

            paymentStatus:
                "pending"
        });


    // ----------------------------------------
    // CLEAR CART
    // ----------------------------------------

    cart.items = [];

    await cart.save();


    // ----------------------------------------
    // RETURN ORDER
    // ----------------------------------------

    return order;
};


// ============================================
// GET USER ORDERS
// ============================================

const getUserOrders = async (
    userId
) => {

    return await Order
        .find({
            user: userId
        })
        .sort({
            createdAt: -1
        });
};


// ============================================
// GET ONE USER ORDER
// ============================================

const getOrderById = async (
    userId,
    orderId
) => {

    const order =
        await Order.findOne({

            _id:
                orderId,

            user:
                userId
        });


    if (!order) {

        throw new ApiError(
            404,
            "Order not found"
        );
    }


    return order;
};


// ============================================
// UPDATE ORDER STATUS
// ============================================

const updateOrderStatus = async (
    orderId,
    newStatus
) => {

    const order =
        await Order.findById(
            orderId
        );


    if (!order) {

        throw new ApiError(
            404,
            "Order not found"
        );
    }


    // ----------------------------------------
    // CURRENT STATUS
    // ----------------------------------------

    const currentStatus =
        order.status;


    // ----------------------------------------
    // STATUS TRANSITIONS
    // ----------------------------------------

    const allowedTransitions = {

        pending: [
            "confirmed",
            "cancelled"
        ],

        confirmed: [
            "processing",
            "cancelled"
        ],

        processing: [
            "shipped"
        ],

        shipped: [
            "delivered"
        ],

        delivered: [],

        cancelled: []
    };


    // ----------------------------------------
    // CHECK TRANSITION
    // ----------------------------------------

    if (
        !allowedTransitions[
            currentStatus
        ].includes(
            newStatus
        )
    ) {

        throw new ApiError(
            400,
            `Cannot change order status from ${currentStatus} to ${newStatus}`
        );
    }


    // ----------------------------------------
    // UPDATE STATUS
    // ----------------------------------------

    order.status =
        newStatus;


    await order.save();


    return order;
};


// ============================================
// EXPORT
// ============================================

module.exports = {

    createOrder,

    getUserOrders,

    getOrderById,

    updateOrderStatus

};