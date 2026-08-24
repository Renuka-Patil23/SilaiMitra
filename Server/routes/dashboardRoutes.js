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
router.get("/summary", getDashboardSummary);


// Recent Orders
router.get("/recent-orders", getRecentOrders);


// Upcoming Deliveries
router.get("/upcoming-deliveries", getUpcomingDeliveries);


// Payment Summary
router.get("/payment-summary", getPaymentSummary);


// Customer Summary
router.get("/customer-summary", getCustomerSummary);


module.exports = router;