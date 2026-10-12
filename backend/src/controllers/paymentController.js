
const paymentService = require("../services/paymentService");
const ApiError = require("../utils/ApiError");

const createPayment = async (req, res) => {
    const { orderId } = req.validated.body;

    const result = await paymentService.createPayment(
        req.user._id,
        orderId
    );

    res.status(201).json({
        message: "Payment checkout is ready",
        payment: result.payment,
        checkoutUrl: result.checkoutUrl
    });
};

const getPaymentByOrder = async (req, res) => {
    const payments = await paymentService.getPaymentByOrder(
        req.user._id,
        req.validated.params.orderId
    );

    res.json({ payments });
};

const verifyPayment = async (req, res) => {
    const payment =
        await paymentService.verifyPaymentByReference(
            req.validated.params.txRef,
            req.user._id
        );

    res.json({
        message: "Payment status retrieved",
        payment
    });
};

const chapaCallback = async (req, res) => {
    const txRef =
        req.query.trx_ref ||
        req.query.tx_ref ||
        req.body?.trx_ref ||
        req.body?.tx_ref;

    if (
        typeof txRef !== "string" ||
        txRef.trim().length === 0
    ) {
        throw new ApiError(
            400,
            "Missing Chapa transaction reference"
        );
    }

    const payment =
        await paymentService.verifyPaymentByReference(
            txRef.trim()
        );

    res.status(200).json({
        message: "Payment status checked",
        payment: {
            transactionReference: payment.transactionReference,
            status: payment.status,
            paymentMethod: payment.paymentMethod
        }
    });
};

module.exports = {
    createPayment,
    getPaymentByOrder,
    verifyPayment,
    chapaCallback
};
