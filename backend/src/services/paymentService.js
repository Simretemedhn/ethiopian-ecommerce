
const axios = require("axios");

const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const getChapaConfig = () => {
    const {
        CHAPA_SECRET_KEY,
        CHAPA_BASE_URL,
        BACKEND_URL,
        FRONTEND_URL
    } = process.env;

    if (
        !CHAPA_SECRET_KEY ||
        !CHAPA_BASE_URL ||
        !BACKEND_URL ||
        !FRONTEND_URL
    ) {
        throw new ApiError(
            500,
            "Payment configuration is incomplete"
        );
    }

    return {
        secretKey: CHAPA_SECRET_KEY,
        baseUrl: CHAPA_BASE_URL.replace(/\/+$/, ""),
        backendUrl: BACKEND_URL.replace(/\/+$/, ""),
        frontendUrl: FRONTEND_URL.replace(/\/+$/, "")
    };
};

const getChapaHeaders = (secretKey) => ({
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json"
});

// Split our single User.name field into the fields
// expected by Chapa.
const splitFullName = (fullName = "") => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    return {
        firstName: parts[0] || "Customer",
        lastName: parts.slice(1).join(" ") || "Customer"
    };
};

const createPayment = async (userId, orderId) => {
    const config = getChapaConfig();

    // Find the order AND verify that it belongs to this user.
    const order = await Order.findOne({
        _id: orderId,
        user: userId
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.status === "cancelled") {
        throw new ApiError(
            400,
            "Cannot pay for a cancelled order"
        );
    }

    if (order.paymentStatus === "paid") {
        throw new ApiError(
            400,
            "Order has already been paid"
        );
    }

    // Reuse an active checkout instead of creating
    // multiple simultaneous payment attempts.
    const activePayment = await Payment.findOne({
        order: order._id,
        status: { $in: ["pending", "processing"] }
    }).sort({ createdAt: -1 });

    if (activePayment) {
        if (activePayment.checkoutUrl) {
            return {
                payment: activePayment,
                checkoutUrl: activePayment.checkoutUrl
            };
        }

        throw new ApiError(
            409,
            "A payment attempt is already being processed"
        );
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { firstName, lastName } = splitFullName(user.name);

    // Create our database record before contacting Chapa.
    const txRef =
        `ORDER-${order._id}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;

    const payment = await Payment.create({
        order: order._id,
        user: userId,
        amount: order.subtotal,
        currency: "ETB",
        provider: "chapa",
        status: "pending",
        transactionReference: txRef
    });

    try {
        const response = await axios.post(
            `${config.baseUrl}/transaction/initialize`,
            {
                amount: payment.amount.toFixed(2),
                currency: payment.currency,
                email: user.email,
                first_name: firstName,
                last_name: lastName,
                tx_ref: txRef,
                return_url:
                    `${config.frontendUrl}/payment/success?orderId=${order._id}`,
                callback_url:
                    `${config.backendUrl}/api/payments/chapa/callback`,
                customization: {
                    title: "Ethiopian E-Commerce",
                    description: `Payment for order ${order._id}`
                }
            },
            {
                headers: getChapaHeaders(config.secretKey),
                timeout: 15000
            }
        );

        const checkoutUrl = response.data?.data?.checkout_url;

        if (
            response.data?.status !== "success" ||
            typeof checkoutUrl !== "string" ||
            !checkoutUrl.startsWith("https://")
        ) {
            throw new ApiError(
                502,
                "Chapa did not return a valid checkout URL"
            );
        }

        payment.status = "processing";
        payment.checkoutUrl = checkoutUrl;
        await payment.save();

        return {
            payment,
            checkoutUrl
        };
    } catch (error) {
        // Preserve intentional application errors.
        if (error instanceof ApiError) {
            payment.status = "failed";
            payment.failureReason = error.message;
            await payment.save();
            throw error;
        }

        payment.status = "failed";
        payment.failureReason =
            "Unable to initialize the Chapa transaction";

        await payment.save();

        console.error(
            "Chapa initialization failed:",
            error.response?.data || error.message
        );

        throw new ApiError(
            502,
            "Payment provider is currently unavailable"
        );
    }
};

// Always verify with Chapa's server-side API.
// Never trust a browser redirect or callback status alone.
const verifyPaymentByReference = async (txRef) => {
    const config = getChapaConfig();

    const payment = await Payment.findOne({
        transactionReference: txRef
    });

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    // Avoid repeating verification for an already completed payment.
    if (payment.status === "completed") {
        return payment;
    }

    let response;

    try {
        response = await axios.get(
            `${config.baseUrl}/transaction/verify/${encodeURIComponent(txRef)}`,
            {
                headers: getChapaHeaders(config.secretKey),
                timeout: 15000
            }
        );
    } catch (error) {
        console.error(
            "Chapa verification request failed:",
            error.response?.data || error.message
        );

        // A network/API error is not proof that payment failed.
        throw new ApiError(
            502,
            "Could not verify the payment with Chapa"
        );
    }

    const verified = response.data?.data;

    if (
        response.data?.status !== "success" ||
        !verified ||
        typeof verified.status !== "string"
    ) {
        throw new ApiError(
            502,
            "Chapa returned an invalid verification response"
        );
    }

    // Confirm that the response belongs to this transaction.
    if (verified.tx_ref !== txRef) {
        throw new ApiError(
            502,
            "Verified transaction reference does not match"
        );
    }

    const verifiedAmount = Number(verified.amount);
    const expectedAmount = Number(payment.amount);

    // Compare currency values to two decimal places.
    if (
        !Number.isFinite(verifiedAmount) ||
        Math.round(verifiedAmount * 100) !==
            Math.round(expectedAmount * 100) ||
        String(verified.currency).toUpperCase() !== payment.currency
    ) {
        throw new ApiError(
            409,
            "Verified payment amount or currency does not match the order"
        );
    }

    const providerStatus = verified.status.toLowerCase();

    if (providerStatus === "success") {
        // A refund or failure must never be overwritten as paid.
        if (
            payment.status === "refunded" ||
            payment.status === "failed"
        ) {
            throw new ApiError(
                409,
                "This payment is no longer eligible for completion"
            );
        }

        payment.status = "completed";
        payment.paymentMethod =
            String(
                verified.method ||
                verified.payment_method ||
                "unknown"
            ).toLowerCase();
        payment.paidAt = new Date();
        payment.failureReason = undefined;

        await payment.save();

        // Update the order only after successful verification.
        const order = await Order.findById(payment.order);

        if (!order) {
            throw new ApiError(
                404,
                "Order associated with payment was not found"
            );
        }

        if (order.status === "cancelled") {
            // Do not silently treat a cancelled order as fulfilled.
            throw new ApiError(
                409,
                "Payment succeeded but the order is cancelled; manual review is required"
            );
        }

        order.paymentStatus = "paid";

        if (order.status === "pending") {
            order.status = "confirmed";
        }

        await order.save();

        return payment;
    }

    if (
        ["failed", "cancelled"].includes(providerStatus)
    ) {
        payment.status = "failed";
        payment.failureReason =
            `Chapa reported payment status: ${providerStatus}`;

        await payment.save();

        const order = await Order.findById(payment.order);

        if (
            order &&
            order.paymentStatus !== "paid"
        ) {
            order.paymentStatus = "failed";
            await order.save();
        }

        return payment;
    }

    // Pending/unknown statuses are not successful payments.
    payment.status = "processing";
    await payment.save();

    return payment;
};

const getPaymentByOrder = async (userId, orderId) => {
    // Authorization: customers can only view their own orders.
    const order = await Order.findOne({
        _id: orderId,
        user: userId
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const payments = await Payment.find({
        order: orderId,
        user: userId
    }).sort({ createdAt: -1 });

    if (payments.length === 0) {
        throw new ApiError(404, "Payment not found");
    }

    return payments;
};

module.exports = {
    createPayment,
    verifyPaymentByReference,
    getPaymentByOrder
};
