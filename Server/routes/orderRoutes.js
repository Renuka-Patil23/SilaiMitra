const express = require("express");
const router = express.Router();

const {
    addOrder,
    getOrders,
    getOrderById,
    getOrdersByCustomer,
    updateOrder,
    deleteOrder,
} = require("../controllers/orderController");



// Add Order
router.post("/", addOrder);

// Get All Orders
router.get("/", getOrders);

// Get Orders By Customer
router.get("/customer/:customerId", getOrdersByCustomer);

// Get Order By ID
router.get("/:id", getOrderById);

// Update Order
router.put("/:id", updateOrder);

// Delete Order
router.delete("/:id", deleteOrder);

module.exports = router;