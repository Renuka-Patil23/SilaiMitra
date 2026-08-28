const { authenticate } = require("../middleware/authMiddleware");

const express = require("express");

const router = express.Router();

const {
    getDashboardSummary,
    getRecentOrders,
    getUpcomingDeliveries,
    getPaymentSummary,
    getCustomerSummary
} = require("../controllers/dashboardController");


// Dashboard Summary
router.get("/summary", authenticate, getDashboardSummary);


// Recent Orders
router.get("/recent-orders", authenticate, getRecentOrders);


// Upcoming Deliveries
router.get("/upcoming-deliveries", authenticate, getUpcomingDeliveries);


// Payment Summary
router.get("/payment-summary", authenticate, getPaymentSummary);


// Customer Summary
router.get("/customer-summary", authenticate, getCustomerSummary);


module.exports = router;