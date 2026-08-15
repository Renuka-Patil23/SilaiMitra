const db = require("../config/db");

// Add Payment
const addPayment = (req, res) => {
    const {
        order_id,
        amount,
        payment_method,
        payment_date,
        notes
    } = req.body;

    // Basic validation
    if (!order_id || !amount || !payment_method || !payment_date) {
        return res.status(400).json({
            success: false,
            message: "Order ID, amount, payment method and payment date are required"
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Payment amount must be greater than 0"
        });
    }

    // Check whether order exists and get total amount
    const orderQuery = `
        SELECT id, total_amount
        FROM orders
        WHERE id = ?
    `;

    db.query(orderQuery, [order_id], (err, orderResult) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to check order",
                error: err.message
            });
        }

        if (orderResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const totalAmount = Number(orderResult[0].total_amount);

        // Get already paid amount
        const paymentQuery = `
            SELECT COALESCE(SUM(amount), 0) AS total_paid
            FROM payments
            WHERE order_id = ?
        `;

        db.query(paymentQuery, [order_id], (err, paymentResult) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to check previous payments",
                    error: err.message
                });
            }

            const totalPaid = Number(paymentResult[0].total_paid);
            const remainingAmount = totalAmount - totalPaid;

            // Prevent overpayment
            if (Number(amount) > remainingAmount) {
                return res.status(400).json({
                    success: false,
                    message: "Payment amount cannot be greater than the remaining amount",
                    remainingAmount: remainingAmount
                });
            }

            // Add payment
            const insertQuery = `
                INSERT INTO payments
                (order_id, amount, payment_method, payment_date, notes)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertQuery,
                [order_id, amount, payment_method, payment_date, notes || null],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Failed to add payment",
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "Payment added successfully",
                        paymentId: result.insertId,
                        remainingAmount: remainingAmount - Number(amount)
                    });
                }
            );
        });
    });
};


// Get All Payments
const getPayments = (req, res) => {
    const query = `
        SELECT 
            p.*,
            o.customer_id,
            o.total_amount
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        ORDER BY p.id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get payments",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            payments: results
        });
    });
};


// Get Payment By ID
const getPaymentById = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT 
            p.*,
            o.customer_id,
            o.total_amount
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE p.id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get payment",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        res.status(200).json({
            success: true,
            payment: results[0]
        });
    });
};


// Get Payments By Order
const getPaymentsByOrder = (req, res) => {
    const { orderId } = req.params;

    const query = `
        SELECT *
        FROM payments
        WHERE order_id = ?
        ORDER BY payment_date DESC, id DESC
    `;

    db.query(query, [orderId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get order payments",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            payments: results
        });
    });
};


// Update Payment
const updatePayment = (req, res) => {
    const { id } = req.params;

    const {
        order_id,
        amount,
        payment_method,
        payment_date,
        notes
    } = req.body;

    if (!order_id || !amount || !payment_method || !payment_date) {
        return res.status(400).json({
            success: false,
            message: "Order ID, amount, payment method and payment date are required"
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Payment amount must be greater than 0"
        });
    }

    // Check order
    const orderQuery = `
        SELECT id, total_amount
        FROM orders
        WHERE id = ?
    `;

    db.query(orderQuery, [order_id], (err, orderResult) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to check order",
                error: err.message
            });
        }

        if (orderResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const totalAmount = Number(orderResult[0].total_amount);

        // Get other payments, excluding current payment
        const paymentQuery = `
            SELECT COALESCE(SUM(amount), 0) AS total_paid
            FROM payments
            WHERE order_id = ?
            AND id != ?
        `;

        db.query(
            paymentQuery,
            [order_id, id],
            (err, paymentResult) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to check previous payments",
                        error: err.message
                    });
                }

                const otherPayments = Number(paymentResult[0].total_paid);

                if (otherPayments + Number(amount) > totalAmount) {
                    return res.status(400).json({
                        success: false,
                        message: "Payment amount cannot make total payments greater than order total",
                        remainingAmount: totalAmount - otherPayments
                    });
                }

                const updateQuery = `
                    UPDATE payments
                    SET
                        order_id = ?,
                        amount = ?,
                        payment_method = ?,
                        payment_date = ?,
                        notes = ?
                    WHERE id = ?
                `;

                db.query(
                    updateQuery,
                    [
                        order_id,
                        amount,
                        payment_method,
                        payment_date,
                        notes || null,
                        id
                    ],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Failed to update payment",
                                error: err.message
                            });
                        }

                        if (result.affectedRows === 0) {
                            return res.status(404).json({
                                success: false,
                                message: "Payment not found"
                            });
                        }

                        res.status(200).json({
                            success: true,
                            message: "Payment updated successfully"
                        });
                    }
                );
            }
        );
    });
};


// Delete Payment
const deletePayment = (req, res) => {
    const { id } = req.params;

    const query = `
        DELETE FROM payments
        WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete payment",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment deleted successfully"
        });
    });
};


module.exports = {
    addPayment,
    getPayments,
    getPaymentById,
    getPaymentsByOrder,
    updatePayment,
    deletePayment
};