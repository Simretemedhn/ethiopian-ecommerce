
const express = require("express");

const {
    createPayment,
    getPaymentByOrder,
    verifyPayment,
    chapaCallback
} = require("../controllers/paymentController");

const asyncHandler = require("../utils/asyncHandler");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
    createPaymentSchema,
    getPaymentByOrderSchema,
    verifyPaymentSchema
} = require("../validators/paymentValidator");

const router = express.Router();

// Chapa callback: public, but verified server-to-server.
router.get(
    "/chapa/callback",
    asyncHandler(chapaCallback)
);

router.post(
    "/chapa/callback",
    asyncHandler(chapaCallback)
);

// All customer-facing payment routes below require authentication.
router.use(protect);

router.post(
    "/",
    validate(createPaymentSchema),
    asyncHandler(createPayment)
);

router.get(
    "/verify/:txRef",
    validate(verifyPaymentSchema),
    asyncHandler(verifyPayment)
);

router.get(
    "/order/:orderId",
    validate(getPaymentByOrderSchema),
    asyncHandler(getPaymentByOrder)
);

module.exports = router;
