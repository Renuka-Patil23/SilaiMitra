const { body, param } = require("express-validator");

const paymentMethods = [
    "Cash",
    "UPI",
    "Card",
    "Bank Transfer",
    "Other"
];


// Add Payment
const addPaymentValidator = [
    body("order_id")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a valid number."),

    body("amount")
        .isFloat({ min: 0.01 })
        .withMessage("Payment amount must be greater than 0."),

    body("payment_method")
        .trim()
        .notEmpty()
        .withMessage("Payment method is required.")
        .isIn(paymentMethods)
        .withMessage("Invalid payment method."),

    body("payment_date")
        .isISO8601()
        .withMessage("Payment date must be a valid date."),

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Notes cannot exceed 1000 characters.")
];


// Update Payment
const updatePaymentValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Payment ID must be a valid number."),

    body("order_id")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a valid number."),

    body("amount")
        .isFloat({ min: 0.01 })
        .withMessage("Payment amount must be greater than 0."),

    body("payment_method")
        .trim()
        .notEmpty()
        .withMessage("Payment method is required.")
        .isIn(paymentMethods)
        .withMessage("Invalid payment method."),

    body("payment_date")
        .isISO8601()
        .withMessage("Payment date must be a valid date."),

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Notes cannot exceed 1000 characters.")
];


// Payment ID
const paymentIdValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Payment ID must be a valid number.")
];


// Order ID
const paymentOrderValidator = [
    param("orderId")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a valid number.")
];

module.exports = {
    addPaymentValidator,
    updatePaymentValidator,
    paymentIdValidator,
    paymentOrderValidator
};