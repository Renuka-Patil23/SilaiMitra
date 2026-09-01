const {
    authenticate,
    authorizeAdmin
} = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

const {
    addOrder,
    getOrders,
    getOrderById,
    getOrdersByCustomer,
    updateOrder,
    deleteOrder,
    filterOrders,
    updateOrderStatus,
    getUpcomingDeliveries
} = require("../controllers/orderController");

const {
    addOrderValidator,
    updateOrderValidator,
    orderIdValidator,
    orderCustomerValidator,
    orderStatusValidator,
    filterOrderValidator
} = require("../validators/orderValidator");

const validateRequest = require("../validators/validateRequest");


// Add Order
router.post("/", authenticate, addOrderValidator, validateRequest, addOrder);

// Get All Orders
router.get("/", authenticate, getOrders);

// Get Orders By Customer
router.get("/customer/:customerId", authenticate, orderCustomerValidator, validateRequest, getOrdersByCustomer);

// Filter Orders 
router.get("/filter", authenticate, filterOrderValidator, validateRequest, filterOrders);

// Get Upcoming Deliveries
router.get("/delivery/upcoming", authenticate, getUpcomingDeliveries);

// Update Order Status
router.patch("/:id/status", authenticate, orderStatusValidator, validateRequest, updateOrderStatus);

// Get Order By ID
router.get("/:id", authenticate, orderIdValidator, validateRequest, getOrderById);

// Update Order
router.put("/:id", authenticate, updateOrderValidator, validateRequest, updateOrder);

// Delete Order
router.delete("/:id", authenticate, authorizeAdmin, orderIdValidator, validateRequest, deleteOrder);

module.exports = router;