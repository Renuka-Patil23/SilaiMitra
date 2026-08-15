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

// Add Payment
router.post("/", addPayment);

// Get All Payments
router.get("/", getPayments);

// Get Payments By Order
router.get("/order/:orderId", getPaymentsByOrder);

// Get Payment By ID
router.get("/:id", getPaymentById);

// Update Payment
router.put("/:id", updatePayment);

// Delete Payment
router.delete("/:id", deletePayment);

module.exports = router;