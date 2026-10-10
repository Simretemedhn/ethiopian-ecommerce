const express =
    require("express");

const {
    createPayment,
    getPaymentByOrder
} =
    require("../controllers/paymentController");

const asyncHandler =
    require("../utils/asyncHandler");

const protect =
    require("../middleware/authMiddleware");

const validate =
    require("../middleware/validateMiddleware");

const {
    createPaymentSchema,
    getPaymentByOrderSchema
} =
    require("../validators/paymentValidator");

const router =
    express.Router();

router.use(
    protect
);

router.post(
    "/",
    validate(createPaymentSchema),
    asyncHandler(createPayment)
);

router.get(
    "/order/:orderId",
    validate(getPaymentByOrderSchema),
    asyncHandler(getPaymentByOrder)
);

module.exports =
    router;