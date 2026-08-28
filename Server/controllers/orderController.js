// Contains the logic for Orders

const db = require("../config/db");

// Add Order
//----------------------
const addOrder = (req, res) => {
    const {
        customer_id,
        measurement_id,
        garment_type = "",
        quantity,
        delivery_date,
        total_amount,
        advance_amount = 0,
        notes = "",
    } = req.body;

    // Basic Validation
    if (
        !customer_id ||
        !measurement_id ||
        !garment_type.trim() ||
        !quantity ||
        !delivery_date ||
        total_amount == null
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields.",
        });
    }

    // Quantity Validation
    if (quantity <= 0) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be greater than 0.",
        });
    }

    // Advance Amount Validation
    if (Number(advance_amount) > Number(total_amount)) {
        return res.status(400).json({
            success: false,
            message: "Advance amount cannot be greater than total amount.",
        });
    }

    // Delivery Date Validation
    const today = new Date().toISOString().split("T")[0];

    if (delivery_date < today) {
        return res.status(400).json({
            success: false,
            message: "Delivery date cannot be earlier than today.",
        });
    }

    // Check Customer Exists
    const customerSql = "SELECT * FROM customers WHERE id = ?";

    db.query(customerSql, [customer_id], (err, customerResult) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error.",
                error: err.message,
            });
        }

        if (customerResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        // Check Measurement
        const measurementSql =
            "SELECT * FROM measurements WHERE id = ? AND customer_id = ?";

        db.query(
            measurementSql,
            [measurement_id, customer_id],
            (err, measurementResult) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error.",
                        error: err.message,
                    });
                }

                if (measurementResult.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Measurement not found for this customer.",
                    });
                }

                // Garment Validation
                if (
                    measurementResult[0].garment_type !== garment_type.trim()
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Selected measurement does not belong to this garment type.",
                    });
                }

                // Calculate Remaining Amount
                const remaining_amount =
                    Number(total_amount) - Number(advance_amount);

                // Insert Order
                const insertSql = `
                    INSERT INTO orders
                    (
                        customer_id,
                        measurement_id,
                        garment_type,
                        quantity,
                        delivery_date,
                        total_amount,
                        advance_amount,
                        remaining_amount,
                        notes
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [
                        customer_id,
                        measurement_id,
                        garment_type.trim(),
                        quantity,
                        delivery_date,
                        total_amount,
                        advance_amount,
                        remaining_amount,
                        notes.trim(),
                    ],
                    (err, result) => {

                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Failed to create order.",
                                error: err.message,
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: "Order created successfully.",
                            orderId: result.insertId,
                        });
                    }
                );
            }
        );
    });
};

// Get All Orders
const getOrders = (req, res) => {

    const sql = `
        SELECT
            o.*,
            c.name AS customer_name
        FROM orders o
        JOIN customers c
            ON o.customer_id = c.id
        ORDER BY o.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch orders.",
                error: err.message,
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            orders: results,
        });

    });

};


// Get Order By ID
const getOrderById = (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            o.*,
            c.name AS customer_name
        FROM orders o
        JOIN customers c
            ON o.customer_id = c.id
        WHERE o.id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch order.",
                error: err.message,
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        res.status(200).json({
            success: true,
            order: results[0],
        });

    });

};


// Get Orders By Customer
const getOrdersByCustomer = (req, res) => {

    const customerId = req.params.customerId;

    const sql = `
        SELECT *
        FROM orders
        WHERE customer_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [customerId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch orders.",
                error: err.message,
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            orders: results,
        });

    });

};

// Update Order
const updateOrder = (req, res) => {

    const id = req.params.id;

    const {
        customer_id,
        measurement_id,
        garment_type = "",
        quantity,
        delivery_date,
        total_amount,
        advance_amount = 0,
        status = "Pending",
        notes = "",
    } = req.body;

    // Basic Validation
    if (
        !customer_id ||
        !measurement_id ||
        !garment_type.trim() ||
        !quantity ||
        !delivery_date ||
        total_amount == null
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields.",
        });
    }

    if (quantity <= 0) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be greater than 0.",
        });
    }

    if (Number(advance_amount) > Number(total_amount)) {
        return res.status(400).json({
            success: false,
            message: "Advance amount cannot be greater than total amount.",
        });
    }

    const today = new Date().toISOString().split("T")[0];

    if (delivery_date < today) {
        return res.status(400).json({
            success: false,
            message: "Delivery date cannot be earlier than today.",
        });
    }

    // Check Customer
    db.query(
        "SELECT * FROM customers WHERE id = ?",
        [customer_id],
        (err, customerResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err.message,
                });
            }

            if (customerResult.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found.",
                });
            }

            // Check Measurement
            db.query(
                "SELECT * FROM measurements WHERE id = ? AND customer_id = ?",
                [measurement_id, customer_id],
                (err, measurementResult) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err.message,
                        });
                    }

                    if (measurementResult.length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: "Measurement not found for this customer.",
                        });
                    }

                    if (
                        measurementResult[0].garment_type !==
                        garment_type.trim()
                    ) {
                        return res.status(400).json({
                            success: false,
                            message:
                                "Selected measurement does not belong to this garment type.",
                        });
                    }

                    const remaining_amount =
                        Number(total_amount) - Number(advance_amount);

                    const sql = `
                        UPDATE orders
                        SET
                            customer_id = ?,
                            measurement_id = ?,
                            garment_type = ?,
                            quantity = ?,
                            delivery_date = ?,
                            total_amount = ?,
                            advance_amount = ?,
                            remaining_amount = ?,
                            status = ?,
                            notes = ?
                        WHERE id = ?
                    `;

                    db.query(
                        sql,
                        [
                            customer_id,
                            measurement_id,
                            garment_type.trim(),
                            quantity,
                            delivery_date,
                            total_amount,
                            advance_amount,
                            remaining_amount,
                            status,
                            notes.trim(),
                            id,
                        ],
                        (err, result) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to update order.",
                                    error: err.message,
                                });
                            }

                            if (result.affectedRows === 0) {
                                return res.status(404).json({
                                    success: false,
                                    message: "Order not found.",
                                });
                            }

                            res.status(200).json({
                                success: true,
                                message: "Order updated successfully.",
                            });

                        }
                    );

                }
            );

        }
    );

};


// Delete Order
const deleteOrder = (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM orders WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete order.",
                    error: err.message,
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Order deleted successfully.",
            });

        }
    );

};

// Filter Orders
const filterOrders = (req, res) => {

    const {
        status,
        garment_type,
        customer_id,
        delivery_date
    } = req.query;

    let sql = `
        SELECT
            o.*,
            c.name AS customer_name,
            c.phone AS customer_phone
        FROM orders o
        JOIN customers c
            ON o.customer_id = c.id
        WHERE 1 = 1
    `;

    const values = [];

    // Filter by status
    if (status) {
        sql += " AND o.status = ?";
        values.push(status);
    }

    // Filter by garment type
    if (garment_type) {
        sql += " AND o.garment_type = ?";
        values.push(garment_type);
    }

    // Filter by customer
    if (customer_id) {
        sql += " AND o.customer_id = ?";
        values.push(customer_id);
    }

    // Filter by delivery date
    if (delivery_date) {
        sql += " AND o.delivery_date = ?";
        values.push(delivery_date);
    }

    sql += " ORDER BY o.id DESC";

    db.query(sql, values, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to filter orders",
                error: err.message,
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            orders: results,
        });
    });
};

// Update Order Status
const updateOrderStatus = (req, res) => {

    const id = req.params.id;
    const { status } = req.body;

    const validStatuses = [
        "Pending",
        "In Progress",
        "Ready",
        "Delivered",
        "Cancelled"
    ];

    // Validate status
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order status.",
            allowedStatuses: validStatuses
        });
    }

    // Check order exists
    const checkSql = "SELECT * FROM orders WHERE id = ?";

    db.query(checkSql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error.",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        // Update status
        const updateSql = `
            UPDATE orders
            SET status = ?
            WHERE id = ?
        `;

        db.query(updateSql, [status, id], (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update order status.",
                    error: err.message
                });
            }

            res.status(200).json({
                success: true,
                message: "Order status updated successfully.",
                orderId: id,
                status: status
            });

        });

    });

};

// Get Upcoming Deliveries
const getUpcomingDeliveries = (req, res) => {

    const sql = `
        SELECT
            o.*,
            c.name AS customer_name,
            c.phone AS customer_phone
        FROM orders o
        JOIN customers c
            ON o.customer_id = c.id
        WHERE o.delivery_date >= CURDATE()
        AND o.status NOT IN ('Delivered', 'Cancelled')
        ORDER BY o.delivery_date ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch upcoming deliveries.",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            deliveries: results
        });

    });

};

module.exports = {
    addOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersByCustomer,
    getUpcomingDeliveries,
    updateOrder,
    deleteOrder,
    filterOrders,
};