// Measurement Controller - Handles all Measurement CRUD operations

const db = require("../config/db");


// Add Measurement

const addMeasurement = (req, res) => {

    const {
        customer_id,
        garment_type,
        chest,
        waist,
        hip,
        shoulder,
        sleeve,
        neck,
        length,
        inseam,
        thigh,
        bottom,
        front_neck,
        back_neck,
        notes = "",
        status = "Active"
    } = req.body;

    // Basic Validation
    if (!customer_id || !garment_type) {
        return res.status(400).json({
            success: false,
            message: "Customer ID and Garment Type are required."
        });
    }

    const sql = `
        INSERT INTO measurements (
            customer_id,
            garment_type,
            chest,
            waist,
            hip,
            shoulder,
            sleeve,
            neck,
            length,
            inseam,
            thigh,
            bottom,
            front_neck,
            back_neck,
            notes,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            customer_id,
            garment_type,
            chest,
            waist,
            hip,
            shoulder,
            sleeve,
            neck,
            length,
            inseam,
            thigh,
            bottom,
            front_neck,
            back_neck,
            notes,
            status
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to add measurements",
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Measurements added successfully",
                measurementId: result.insertId
            });

        }
    );

};


// Get All Measurements

const getMeasurements = (req, res) => {

    const sql = `
        SELECT *
        FROM measurements
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch measurements",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            measurements: results
        });

    });

};


// Get Measurement By ID

const getMeasurementById = (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT *
        FROM measurements
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch measurement",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Measurement not found"
            });
        }

        res.status(200).json({
            success: true,
            measurement: results[0]
        });

    });

};


// Get Measurements By Customer ID

const getMeasurementsByCustomer = (req, res) => {

    const customerId = req.params.customerId;

    const sql = `
        SELECT *
        FROM measurements
        WHERE customer_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [customerId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch customer measurements",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            measurements: results
        });

    });

};


// Update Measurement

const updateMeasurement = (req, res) => {

    const id = req.params.id;

    const {
        customer_id,
        garment_type,
        chest,
        waist,
        hip,
        shoulder,
        sleeve,
        neck,
        length,
        inseam,
        thigh,
        bottom,
        front_neck,
        back_neck,
        notes = "",
        status = "Active"
    } = req.body;

    // Basic Validation
    if (!customer_id || !garment_type) {
        return res.status(400).json({
            success: false,
            message: "Customer ID and Garment Type are required."
        });
    }

    const sql = `
        UPDATE measurements
        SET
            customer_id = ?,
            garment_type = ?,
            chest = ?,
            waist = ?,
            hip = ?,
            shoulder = ?,
            sleeve = ?,
            neck = ?,
            length = ?,
            inseam = ?,
            thigh = ?,
            bottom = ?,
            front_neck = ?,
            back_neck = ?,
            notes = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            customer_id,
            garment_type,
            chest,
            waist,
            hip,
            shoulder,
            sleeve,
            neck,
            length,
            inseam,
            thigh,
            bottom,
            front_neck,
            back_neck,
            notes,
            status,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update measurements",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Measurement not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Measurements updated successfully"
            });

        }
    );

};


// Delete Measurement

const deleteMeasurement = (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM measurements WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete measurement",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Measurement not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Measurement deleted successfully"
        });

    });

};


// Export Functions

module.exports = {
    addMeasurement,
    getMeasurements,
    getMeasurementById,
    getMeasurementsByCustomer,
    updateMeasurement,
    deleteMeasurement,
};