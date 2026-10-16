
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const notificationService = require("./notificationService");

// Create a notification without making the main operation fail.
const safelyNotify = async (notification) => {
    try {
        await notificationService.createNotification(notification);
    } catch (error) {
        console.error("Could not create notification:", error.message);
    }
};

// ============================================
// CREATE ORDER FROM CART
// ============================================

const createOrder = async (userId) => {
    const cart = await Cart.findOne({ user: userId })
        .populate("items.product");

    if (!cart || !cart.items || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty");
    }

    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
        if (!cartItem.product) {
            throw new ApiError(
                400,
                "A product in your cart no longer exists"
            );
        }

        const product = cartItem.product;

        // Save a snapshot of the product details at purchase time.
        orderItems.push({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: cartItem.quantity
        });

        subtotal += product.price * cartItem.quantity;
    }

    const order = await Order.create({
        user: userId,
        items: orderItems,
        subtotal,
        status: "pending",
        paymentStatus: "pending"
    });

    // Clear the cart after the order has been created.
    cart.items = [];
    await cart.save();

    // Notification errors must not turn a successful order into a failed request.
    await safelyNotify({
        recipient: userId,
        type: "order_created",
        title: "Order placed successfully",
        message: `Your order ${order._id} has been created and is awaiting payment.`,
        data: {
            orderId: order._id,
            orderStatus: order.status,
            paymentStatus: order.paymentStatus
        }
    });

    return order;
};

// ============================================
// GET USER ORDERS
// ============================================

const getUserOrders = async (userId) => {
    return Order.find({ user: userId })
        .sort({ createdAt: -1 });
};

// ============================================
// GET ONE USER ORDER
// ============================================

const getOrderById = async (userId, orderId) => {
    const order = await Order.findOne({
        _id: orderId,
        user: userId
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return order;
};

// ============================================
// UPDATE ORDER STATUS
// ============================================

const updateOrderStatus = async (orderId, newStatus) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const currentStatus = order.status;

    const allowedTransitions = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["processing", "cancelled"],
        processing: ["shipped"],
        shipped: ["delivered"],
        delivered: [],
        cancelled: []
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
        throw new ApiError(
            400,
            `Cannot change order status from ${currentStatus} to ${newStatus}`
        );
    }

    order.status = newStatus;
    await order.save();

    await safelyNotify({
        recipient: order.user,
        type: "order_status",
        title: "Order status updated",
        message: `Your order ${order._id} status changed from ${currentStatus} to ${newStatus}.`,
        data: {
            orderId: order._id,
            previousStatus: currentStatus,
            orderStatus: newStatus
        }
    });

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
