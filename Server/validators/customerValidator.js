const { body, param, query } = require("express-validator");

// Validation for adding customer
const addCustomerValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .matches(/^[0-9]{10}$/)
        .withMessage("Phone number must contain exactly 10 digits."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address."),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required.")
        .isLength({ max: 255 })
        .withMessage("Address cannot exceed 255 characters.")
];


// Validation for updating customer
const updateCustomerValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Customer ID must be a valid number."),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .matches(/^[0-9]{10}$/)
        .withMessage("Phone number must contain exactly 10 digits."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address."),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required.")
        .isLength({ max: 255 })
        .withMessage("Address cannot exceed 255 characters.")
];


// Validation for customer ID
const customerIdValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Customer ID must be a valid number.")
];


// Validation for search
const searchCustomerValidator = [
    query("name")
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage("Search name cannot be empty."),

    query("phone")
        .optional()
        .trim()
        .matches(/^[0-9]+$/)
        .withMessage("Phone search must contain only numbers.")
];

module.exports = {
    addCustomerValidator,
    updateCustomerValidator,
    customerIdValidator,
    searchCustomerValidator
};