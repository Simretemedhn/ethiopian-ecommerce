const paymentService =
    require("../services/paymentService");

const createPayment = async (
    req,
    res
) => {
    const {
        orderId
    } = req.validated.body;

    const result =
        await paymentService.createPayment(
            req.user._id,
            orderId
        );

    res.status(201).json({
        message:
            "Payment initiated successfully",

        payment:
            result.payment,

        checkoutUrl:
            result.checkoutUrl
    });
};

const getPaymentByOrder = async (
    req,
    res
) => {
    const payment =
        await paymentService.getPaymentByOrder(
            req.user._id,
            req.validated.params.orderId
        );

    res.json({
        payment
    });
};

module.exports = {
    createPayment,
    getPaymentByOrder
};
