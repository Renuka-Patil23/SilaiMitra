const { body, param, query } = require("express-validator");

const validStatuses = [
    "Pending",
    "In Progress",
    "Ready",
    "Delivered",
    "Cancelled"
];


// Add Order
const addOrderValidator = [
    body("customer_id")
        .isInt({ min: 1 })
        .withMessage("Customer ID must be a valid number."),

    body("measurement_id")
        .isInt({ min: 1 })
        .withMessage("Measurement ID must be a valid number."),

    body("garment_type")
        .trim()
        .notEmpty()
        .withMessage("Garment type is required."),

    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1."),

    body("delivery_date")
        .isISO8601()
        .withMessage("Delivery date must be a valid date."),

    body("total_amount")
        .isFloat({ min: 0.01 })
        .withMessage("Total amount must be greater than 0."),

    body("advance_amount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Advance amount cannot be negative."),

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Notes cannot exceed 1000 characters.")
];


// Update Order
const updateOrderValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a valid number."),

    body("customer_id")
        .isInt({ min: 1 })
        .withMessage("Customer ID must be a valid number."),

    body("measurement_id")
        .isInt({ min: 1 })
        .withMessage("Measurement ID must be a valid number."),

    body("garment_type")
        .trim()
        .notEmpty()
        .withMessage("Garment type is required."),

    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1."),

    body("delivery_date")
        .isISO8601()
        .withMessage("Delivery date must be a valid date."),

    body("total_amount")
        .isFloat({ min: 0.01 })
        .withMessage("Total amount must be greater than 0."),

    body("advance_amount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Advance amount cannot be negative."),

    body("status")
        .optional()
        .isIn(validStatuses)
        .withMessage("Invalid order status."),

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Notes cannot exceed 1000 characters.")
];


// Order ID
const orderIdValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a valid number.")
];


// Customer ID
const orderCustomerValidator = [
    param("customerId")
        .isInt({ min: 1 })
        .withMessage("Customer ID must be a valid number.")
];


// Update Order Status
const orderStatusValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a valid number."),

    body("status")
        .isIn(validStatuses)
        .withMessage("Invalid order status.")
];


// Filter Orders
const filterOrderValidator = [
    query("status")
        .optional()
        .isIn(validStatuses)
        .withMessage("Invalid order status."),

    query("customer_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Customer ID must be a valid number."),

    query("delivery_date")
        .optional()
        .isISO8601()
        .withMessage("Delivery date must be a valid date.")
];

module.exports = {
    addOrderValidator,
    updateOrderValidator,
    orderIdValidator,
    orderCustomerValidator,
    orderStatusValidator,
    filterOrderValidator
};