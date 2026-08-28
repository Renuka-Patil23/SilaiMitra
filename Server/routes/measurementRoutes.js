// Measurement Routes
const { authenticate } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

const {
    addMeasurement,
    getMeasurements,
    getMeasurementById,
    getMeasurementsByCustomer,
    updateMeasurement,
    deleteMeasurement,
} = require("../controllers/measurementController");

const {
    addMeasurementValidator,
    updateMeasurementValidator,
    measurementIdValidator,
    measurementCustomerValidator
} = require("../validators/measurementValidator");

const validateRequest = require("../validators/validateRequest");

// Add Measurement
router.post("/", authenticate, addMeasurementValidator, validateRequest, addMeasurement);

// Get All Measurements
router.get("/", authenticate, getMeasurements);

// Get All Measurements of One Customer
router.get("/customer/:customerId", authenticate, measurementCustomerValidator, validateRequest, getMeasurementsByCustomer);

// Get Measurement By ID
router.get("/:id", authenticate, measurementIdValidator, validateRequest, getMeasurementById);

// Update Measurement
router.put("/:id", authenticate, updateMeasurementValidator, validateRequest, updateMeasurement);

// Delete Measurement
router.delete("/:id", authenticate, measurementIdValidator, validateRequest, deleteMeasurement);

module.exports = router;