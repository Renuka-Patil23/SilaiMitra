const {
    authenticate,
    authorizeAdmin
} = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

const {
    addPayment,
    getPayments,
    getPaymentById,
    getPaymentsByOrder,
    updatePayment,
    deletePayment
} = require("../controllers/paymentController");

const {
    addPaymentValidator,
    updatePaymentValidator,
    paymentIdValidator,
    paymentOrderValidator
} = require("../validators/paymentValidator");

const validateRequest = require("../validators/validateRequest");

// Add Payment
router.post("/", authenticate, addPaymentValidator, validateRequest, addPayment);

// Get All Payments
router.get("/", authenticate, getPayments);

// Get Payments By Order
router.get("/order/:orderId", authenticate, paymentOrderValidator, validateRequest, getPaymentsByOrder);

// Get Payment By ID
router.get("/:id", authenticate, paymentIdValidator, validateRequest, getPaymentById);

// Update Payment
router.put("/:id", authenticate, updatePaymentValidator, validateRequest, updatePayment);

// Delete Payment
router.delete("/:id", authenticate, authorizeAdmin, paymentIdValidator, validateRequest, deletePayment);

module.exports = router;