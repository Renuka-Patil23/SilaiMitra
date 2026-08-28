const { body, param } = require("express-validator");

const measurementFields = [
    "chest",
    "waist",
    "hip",
    "shoulder",
    "sleeve",
    "neck",
    "length",
    "inseam",
    "thigh",
    "bottom",
    "front_neck",
    "back_neck"
];

const measurementValidators = measurementFields.map((field) =>
    body(field)
        .optional({ values: "null" })
        .isFloat({ min: 0 })
        .withMessage(`${field} must be a positive number.`)
);


// Add measurement
const addMeasurementValidator = [
    body("customer_id")
        .isInt({ min: 1 })
        .withMessage("Customer ID must be a valid number."),

    body("garment_type")
        .trim()
        .notEmpty()
        .withMessage("Garment type is required."),

    ...measurementValidators,

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Notes cannot exceed 1000 characters."),

    body("status")
        .optional()
        .isIn(["Active", "Archived"])
        .withMessage("Status must be Active or Archived.")
];


// Update measurement
const updateMeasurementValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Measurement ID must be a valid number."),

    body("customer_id")
        .isInt({ min: 1 })
        .withMessage("Customer ID must be a valid number."),

    body("garment_type")
        .trim()
        .notEmpty()
        .withMessage("Garment type is required."),

    ...measurementValidators,

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Notes cannot exceed 1000 characters."),

    body("status")
        .optional()
        .isIn(["Active", "Archived"])
        .withMessage("Status must be Active or Archived.")
];


// Measurement ID
const measurementIdValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Measurement ID must be a valid number.")
];


// Customer ID in URL
const measurementCustomerValidator = [
    param("customerId")
        .isInt({ min: 1 })
        .withMessage("Customer ID must be a valid number.")
];

module.exports = {
    addMeasurementValidator,
    updateMeasurementValidator,
    measurementIdValidator,
    measurementCustomerValidator
};