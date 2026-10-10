const axios = require("axios");

const Payment =
    require("../models/Payment");

const Order =
    require("../models/Order");

const User =
    require("../models/User");

const ApiError =
    require("../utils/ApiError");

const createPayment = async (
    userId,
    orderId
) => {
    const order =
        await Order.findOne({
            _id: orderId,
            user: userId
        });

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (
        order.status === "cancelled"
    ) {
        throw new ApiError(
            400,
            "Cannot pay for a cancelled order"
        );
    }

    if (
        order.paymentStatus === "paid"
    ) {
        throw new ApiError(
            400,
            "Order has already been paid"
        );
    }

    const existingPayment =
        await Payment.findOne({
            order: orderId
        });

    if (existingPayment) {
        throw new ApiError(
            400,
            "A payment already exists for this order"
        );
    }

    const user =
        await User.findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const txRef =
        `ORDER-${order._id}-${Date.now()}`;

    const payment =
        await Payment.create({
            order: order._id,
            user: userId,
            amount: order.subtotal,
            currency: "ETB",
            provider: "chapa",
            status: "pending",
            transactionReference: txRef
        });

    try {
        const response =
            await axios.post(
                `${process.env.CHAPA_BASE_URL}/transaction/initialize`,
                {
                    amount:
                        order.subtotal.toString(),

                    currency: "ETB",

                    email:
                        user.email,

                    first_name:
                        user.name,

                    tx_ref:
                        txRef,

                    return_url:
                        `${process.env.FRONTEND_URL}/payment/success`,

                    callback_url:
                        `${process.env.BACKEND_URL}/api/payments/chapa/callback`
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${process.env.CHAPA_SECRET_KEY}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

        if (
            response.data?.status !==
            "success"
        ) {
            payment.status =
                "failed";

            payment.failureReason =
                "Chapa failed to initialize the transaction";

            await payment.save();

            throw new ApiError(
                400,
                "Unable to initialize Chapa payment"
            );
        }

        payment.status =
            "processing";

        await payment.save();

        return {
            payment,
            checkoutUrl:
                response.data.data.checkout_url
        };

    } catch (error) {

        if (
            error instanceof ApiError
        ) {
            throw error;
        }

        payment.status =
            "failed";

        payment.failureReason =
            "Chapa API request failed";

        await payment.save();

        console.error(
            "Chapa payment initialization failed:",
            error.response?.data ||
            error.message
        );

        throw new ApiError(
            502,
            "Payment provider is currently unavailable"
        );
    }
};

const getPaymentByOrder = async (
    userId,
    orderId
) => {
    const order =
        await Order.findOne({
            _id: orderId,
            user: userId
        });

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    const payment =
        await Payment.findOne({
            order: orderId
        });

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    return payment;
};

module.exports = {
    createPayment,
    getPaymentByOrder
};