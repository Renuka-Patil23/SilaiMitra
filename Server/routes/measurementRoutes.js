// Measurement Routes

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

// Add Measurement
router.post("/", addMeasurement);

// Get All Measurements
router.get("/", getMeasurements);

// Get All Measurements of One Customer
router.get("/customer/:customerId", getMeasurementsByCustomer);

// Get Measurement By ID
router.get("/:id", getMeasurementById);

// Update Measurement
router.put("/:id", updateMeasurement);

// Delete Measurement
router.delete("/:id", deleteMeasurement);

module.exports = router;