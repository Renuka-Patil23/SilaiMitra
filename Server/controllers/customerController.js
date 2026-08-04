// Customer Controller - Handles all Customer CRUD operations

const db = require("../config/db");

// Add Customer
const addCustomer = (req, res) => {
    const { name = "", phone = "", email = "", address = "" } = req.body;

    // Basic Validation
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name, phone, email and address are required.",
        });
    }

    const sql =
        "INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)";

    db.query(sql, [name.trim(), phone.trim(), email.trim(), address.trim()], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to add customer",
                error: err.message,
            });
        }

        res.status(201).json({
            success: true,
            message: "Customer added successfully",
            customerId: result.insertId,
        });
    });
};

// Get All Customers
const getCustomers = (req, res) => {
    const sql = "SELECT * FROM customers ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch customers",
                error: err.message,
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            customers: results,
        });
    });
};

// Get Customer By ID
const getCustomerById = (req, res) => {
    const id = req.params.id;

    const sql = "SELECT * FROM customers WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch customer",
                error: err.message,
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            customer: results[0],
        });
    });
};

// Update Customer
const updateCustomer = (req, res) => {
    const id = req.params.id;

    const {
        name = "",
        phone = "",
        email = "",
        address = "",
    } = req.body;

    // Basic Validation
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name, phone, email and address are required.",
        });
    }

    const sql = `
        UPDATE customers
        SET name = ?, phone = ?, email = ?, address = ?
        WHERE id = ?
    `;

    db.query(sql, [name.trim(), phone.trim(), email.trim(), address.trim(), id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to update customer",
                error: err.message,
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
        });
    });
};

// Delete Customer
const deleteCustomer = (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM customers WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete customer",
                error: err.message,
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
        });
    });
};

module.exports = {
    addCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};
