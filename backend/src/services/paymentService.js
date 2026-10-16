
const axios = require("axios");

const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const notificationService = require("./notificationService");

// Notification failures should not interrupt payment processing.
const safelyNotify = async (notification) => {
    try {
        await notificationService.createNotification(notification);
    } catch (error) {
        console.error("Could not create payment notification:", error.message);
    }
};

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
        throw new ApiError(500, "Payment configuration is incomplete");
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

const splitFullName = (fullName = "") => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    return {
        firstName: parts[0] || "Customer",
        lastName: parts.slice(1).join(" ") || "Customer"
    };
};

// ============================================
// INITIALIZE PAYMENT
// ============================================

const createPayment = async (userId, orderId) => {
    const config = getChapaConfig();

    const order = await Order.findOne({
        _id: orderId,
        user: userId
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.status === "cancelled") {
        throw new ApiError(400, "Cannot pay for a cancelled order");
    }

    if (order.paymentStatus === "paid") {
        throw new ApiError(400, "Order has already been paid");
    }

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

        return { payment, checkoutUrl };
    } catch (error) {
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

// ============================================
// VERIFY PAYMENT WITH CHAPA
// ============================================

const verifyPaymentByReference = async (txRef) => {
    const config = getChapaConfig();

    const payment = await Payment.findOne({
        transactionReference: txRef
    });

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    // Repeated verification of a completed payment must not
    // create another success notification.
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

        // A connection error does not prove the payment failed.
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

    if (verified.tx_ref !== txRef) {
        throw new ApiError(
            502,
            "Verified transaction reference does not match"
        );
    }

    const verifiedAmount = Number(verified.amount);
    const expectedAmount = Number(payment.amount);

    if (
        !Number.isFinite(verifiedAmount) ||
        Math.round(verifiedAmount * 100) !==
            Math.round(expectedAmount * 100) ||
        String(verified.currency).toUpperCase() !== payment.currency
    ) {
        throw new ApiError(
            409,
            "Verified payment amount or currency does not match"
        );
    }

    const providerStatus = verified.status.toLowerCase();

    // ----------------------------------------
    // VERIFIED SUCCESS
    // ----------------------------------------

    if (providerStatus === "success") {
        if (
            payment.status === "refunded" ||
            payment.status === "failed"
        ) {
            throw new ApiError(
                409,
                "This payment is no longer eligible for completion"
            );
        }

        const order = await Order.findById(payment.order);

        if (!order) {
            throw new ApiError(
                404,
                "Order associated with payment was not found"
            );
        }

        if (order.status === "cancelled") {
            throw new ApiError(
                409,
                "Payment succeeded but the order is cancelled; manual review is required"
            );
        }

        payment.status = "completed";
        payment.paymentMethod = String(
            verified.method ||
            verified.payment_method ||
            "unknown"
        ).toLowerCase();
        payment.paidAt = new Date();
        payment.failureReason = undefined;

        await payment.save();

        order.paymentStatus = "paid";

        if (order.status === "pending") {
            order.status = "confirmed";
        }

        await order.save();

        // Only notify after the verified payment and order updates.
        await safelyNotify({
            recipient: payment.user,
            type: "payment_success",
            title: "Payment successful",
            message: `Payment for order ${order._id} was verified successfully.`,
            data: {
                orderId: order._id,
                paymentId: payment._id,
                transactionReference: txRef,
                amount: payment.amount,
                currency: payment.currency,
                paymentStatus: payment.status,
                orderStatus: order.status
            }
        });

        return payment;
    }

    // ----------------------------------------
    // VERIFIED FAILURE OR CANCELLATION
    // ----------------------------------------

    if (["failed", "cancelled"].includes(providerStatus)) {
        // Remember whether this attempt was already marked failed.
        const wasAlreadyFailed = payment.status === "failed";

        payment.status = "failed";
        payment.failureReason =
            `Chapa reported payment status: ${providerStatus}`;

        await payment.save();

        const order = await Order.findById(payment.order);

        if (order && order.paymentStatus !== "paid") {
            order.paymentStatus = "failed";
            await order.save();

            // Only notify when this attempt first transitions to failed.
            if (!wasAlreadyFailed) {
                await safelyNotify({
                    recipient: payment.user,
                    type: "payment_failed",
                    title: "Payment unsuccessful",
                    message:
                        `Payment for order ${order._id} was reported as ${providerStatus} by Chapa.`,
                    data: {
                        orderId: order._id,
                        paymentId: payment._id,
                        transactionReference: txRef,
                        paymentStatus: payment.status,
                        providerStatus
                    }
                });
            }
        }

        return payment;
    }

    // Pending or unfamiliar statuses are not payment failures.
    payment.status = "processing";
    await payment.save();

    return payment;
};

// ============================================
// GET PAYMENTS FOR AN ORDER
// ============================================

const getPaymentByOrder = async (userId, orderId) => {
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
