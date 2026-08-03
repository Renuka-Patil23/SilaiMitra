// Contains the logic (insert customer into database)

const db = require("../config/db");

// Add Customer
const addCustomer = (req, res) => {
    const { name, phone, email, address } = req.body;

    const sql =
        "INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, phone, email, address], (err, result) => {
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

module.exports = {
    addCustomer,
    getCustomers,
};