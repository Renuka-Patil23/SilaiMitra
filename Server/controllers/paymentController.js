const db = require("../config/db");

// =====================================================
// ADD PAYMENT
// =====================================================

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

    if (Number(amount) <= 0) {
        return res.status(400).json({
            success: false,
            message: "Payment amount must be greater than 0"
        });
    }

    // Check whether order exists
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

            const remainingAmount =
                totalAmount - totalPaid;

            // Prevent overpayment
            if (Number(amount) > remainingAmount) {
                return res.status(400).json({
                    success: false,
                    message: "Payment amount cannot be greater than the remaining amount",
                    remainingAmount: remainingAmount
                });
            }

            // Insert payment
            const insertQuery = `
                INSERT INTO payments
                (
                    order_id,
                    amount,
                    payment_method,
                    payment_date,
                    notes
                )
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertQuery,
                [
                    order_id,
                    amount,
                    payment_method,
                    payment_date,
                    notes || null
                ],
                (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Failed to add payment",
                            error: err.message
                        });
                    }

                    // Calculate updated amounts
                    const newTotalPaid =
                        totalPaid + Number(amount);

                    const newRemainingAmount =
                        totalAmount - newTotalPaid;

                    // Update order amounts
                    const updateOrderQuery = `
                        UPDATE orders
                        SET
                            advance_amount = ?,
                            remaining_amount = ?
                        WHERE id = ?
                    `;

                    db.query(
                        updateOrderQuery,
                        [
                            newTotalPaid,
                            newRemainingAmount,
                            order_id
                        ],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Payment added but failed to update order amount",
                                    error: err.message
                                });
                            }

                            res.status(201).json({
                                success: true,
                                message: "Payment added successfully",
                                paymentId: result.insertId,
                                totalPaid: newTotalPaid,
                                remainingAmount: newRemainingAmount
                            });
                        }
                    );
                }
            );
        });
    });
};


// =====================================================
// GET ALL PAYMENTS
// =====================================================

const getPayments = (req, res) => {

    const query = `
        SELECT
            p.*,
            o.customer_id,
            o.total_amount
        FROM payments p
        JOIN orders o
            ON p.order_id = o.id
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


// =====================================================
// GET PAYMENT BY ID
// =====================================================

const getPaymentById = (req, res) => {

    const { id } = req.params;

    const query = `
        SELECT
            p.*,
            o.customer_id,
            o.total_amount
        FROM payments p
        JOIN orders o
            ON p.order_id = o.id
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


// =====================================================
// GET PAYMENTS BY ORDER
// =====================================================

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


// =====================================================
// UPDATE PAYMENT
// =====================================================

const updatePayment = (req, res) => {

    const { id } = req.params;

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
            message:
                "Order ID, amount, payment method and payment date are required"
        });
    }

    if (Number(amount) <= 0) {
        return res.status(400).json({
            success: false,
            message: "Payment amount must be greater than 0"
        });
    }

    // First get existing payment
    const existingPaymentQuery = `
        SELECT id, order_id, amount
        FROM payments
        WHERE id = ?
    `;

    db.query(
        existingPaymentQuery,
        [id],
        (err, existingPaymentResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to find payment",
                    error: err.message
                });
            }

            if (existingPaymentResult.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Payment not found"
                });
            }

            const oldOrderId =
                existingPaymentResult[0].order_id;

            // Check new order
            const orderQuery = `
                SELECT id, total_amount
                FROM orders
                WHERE id = ?
            `;

            db.query(
                orderQuery,
                [order_id],
                (err, orderResult) => {

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

                    const totalAmount =
                        Number(orderResult[0].total_amount);

                    // Get payments excluding current payment
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
                                    message:
                                        "Failed to check previous payments",
                                    error: err.message
                                });
                            }

                            const otherPayments =
                                Number(paymentResult[0].total_paid);

                            // Prevent overpayment
                            if (
                                otherPayments + Number(amount)
                                > totalAmount
                            ) {
                                return res.status(400).json({
                                    success: false,
                                    message:
                                        "Payment amount cannot make total payments greater than order total",
                                    remainingAmount:
                                        totalAmount - otherPayments
                                });
                            }

                            // Update payment
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
                                            message:
                                                "Failed to update payment",
                                            error: err.message
                                        });
                                    }

                                    if (
                                        result.affectedRows === 0
                                    ) {
                                        return res.status(404).json({
                                            success: false,
                                            message:
                                                "Payment not found"
                                        });
                                    }

                                    // New order total paid
                                    const newTotalPaid =
                                        otherPayments +
                                        Number(amount);

                                    const newRemainingAmount =
                                        totalAmount -
                                        newTotalPaid;

                                    // Update new order
                                    const updateNewOrderQuery = `
                                        UPDATE orders
                                        SET
                                            advance_amount = ?,
                                            remaining_amount = ?
                                        WHERE id = ?
                                    `;

                                    db.query(
                                        updateNewOrderQuery,
                                        [
                                            newTotalPaid,
                                            newRemainingAmount,
                                            order_id
                                        ],
                                        (err) => {

                                            if (err) {
                                                return res.status(500).json({
                                                    success: false,
                                                    message:
                                                        "Payment updated but failed to update new order amount",
                                                    error: err.message
                                                });
                                            }

                                            // If payment moved to
                                            // another order, recalculate
                                            // old order also.
                                            if (
                                                String(oldOrderId) !==
                                                String(order_id)
                                            ) {

                                                const oldOrderQuery = `
                                                    SELECT total_amount
                                                    FROM orders
                                                    WHERE id = ?
                                                `;

                                                db.query(
                                                    oldOrderQuery,
                                                    [oldOrderId],
                                                    (err, oldOrderResult) => {

                                                        if (err) {
                                                            return res.status(500).json({
                                                                success: false,
                                                                message:
                                                                    "Payment updated but failed to check old order",
                                                                error: err.message
                                                            });
                                                        }

                                                        if (
                                                            oldOrderResult.length === 0
                                                        ) {
                                                            return res.status(200).json({
                                                                success: true,
                                                                message:
                                                                    "Payment updated successfully",
                                                                totalPaid:
                                                                    newTotalPaid,
                                                                remainingAmount:
                                                                    newRemainingAmount
                                                            });
                                                        }

                                                        const oldTotalAmount =
                                                            Number(
                                                                oldOrderResult[0]
                                                                    .total_amount
                                                            );

                                                        const oldPaidQuery = `
                                                            SELECT COALESCE(SUM(amount), 0)
                                                            AS total_paid
                                                            FROM payments
                                                            WHERE order_id = ?
                                                        `;

                                                        db.query(
                                                            oldPaidQuery,
                                                            [oldOrderId],
                                                            (err, oldPaidResult) => {

                                                                if (err) {
                                                                    return res.status(500).json({
                                                                        success: false,
                                                                        message:
                                                                            "Payment updated but failed to calculate old order amount",
                                                                        error: err.message
                                                                    });
                                                                }

                                                                const oldTotalPaid =
                                                                    Number(
                                                                        oldPaidResult[0]
                                                                            .total_paid
                                                                    );

                                                                const oldRemaining =
                                                                    oldTotalAmount -
                                                                    oldTotalPaid;

                                                                const updateOldOrderQuery = `
                                                                    UPDATE orders
                                                                    SET
                                                                        advance_amount = ?,
                                                                        remaining_amount = ?
                                                                    WHERE id = ?
                                                                `;

                                                                db.query(
                                                                    updateOldOrderQuery,
                                                                    [
                                                                        oldTotalPaid,
                                                                        oldRemaining,
                                                                        oldOrderId
                                                                    ],
                                                                    (err) => {

                                                                        if (err) {
                                                                            return res.status(500).json({
                                                                                success: false,
                                                                                message:
                                                                                    "Payment updated but old order amount could not be updated",
                                                                                error: err.message
                                                                            });
                                                                        }

                                                                        res.status(200).json({
                                                                            success: true,
                                                                            message:
                                                                                "Payment updated successfully",
                                                                            totalPaid:
                                                                                newTotalPaid,
                                                                            remainingAmount:
                                                                                newRemainingAmount
                                                                        });
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );

                                            } else {

                                                res.status(200).json({
                                                    success: true,
                                                    message:
                                                        "Payment updated successfully",
                                                    totalPaid:
                                                        newTotalPaid,
                                                    remainingAmount:
                                                        newRemainingAmount
                                                });
                                            }
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};


// =====================================================
// DELETE PAYMENT
// =====================================================

const deletePayment = (req, res) => {

    const { id } = req.params;

    // First find payment and its order
    const getPaymentQuery = `
        SELECT
            id,
            order_id,
            amount
        FROM payments
        WHERE id = ?
    `;

    db.query(
        getPaymentQuery,
        [id],
        (err, paymentResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to find payment",
                    error: err.message
                });
            }

            if (paymentResult.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Payment not found"
                });
            }

            const orderId =
                paymentResult[0].order_id;

            // Delete payment
            const deleteQuery = `
                DELETE FROM payments
                WHERE id = ?
            `;

            db.query(
                deleteQuery,
                [id],
                (err, result) => {

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

                    // Recalculate total paid
                    const totalPaidQuery = `
                        SELECT COALESCE(SUM(amount), 0)
                        AS total_paid
                        FROM payments
                        WHERE order_id = ?
                    `;

                    db.query(
                        totalPaidQuery,
                        [orderId],
                        (err, paidResult) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Payment deleted but failed to calculate total paid",
                                    error: err.message
                                });
                            }

                            const totalPaid =
                                Number(
                                    paidResult[0].total_paid
                                );

                            // Get order total
                            const orderQuery = `
                                SELECT total_amount
                                FROM orders
                                WHERE id = ?
                            `;

                            db.query(
                                orderQuery,
                                [orderId],
                                (err, orderResult) => {

                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message:
                                                "Payment deleted but failed to get order total",
                                            error: err.message
                                        });
                                    }

                                    if (
                                        orderResult.length === 0
                                    ) {
                                        return res.status(404).json({
                                            success: false,
                                            message:
                                                "Order not found"
                                        });
                                    }

                                    const totalAmount =
                                        Number(
                                            orderResult[0]
                                                .total_amount
                                        );

                                    const remainingAmount =
                                        totalAmount -
                                        totalPaid;

                                    // Update order amounts
                                    const updateOrderQuery = `
                                        UPDATE orders
                                        SET
                                            advance_amount = ?,
                                            remaining_amount = ?
                                        WHERE id = ?
                                    `;

                                    db.query(
                                        updateOrderQuery,
                                        [
                                            totalPaid,
                                            remainingAmount,
                                            orderId
                                        ],
                                        (err) => {

                                            if (err) {
                                                return res.status(500).json({
                                                    success: false,
                                                    message:
                                                        "Payment deleted but order amount could not be updated",
                                                    error: err.message
                                                });
                                            }

                                            res.status(200).json({
                                                success: true,
                                                message:
                                                    "Payment deleted successfully",
                                                totalPaid:
                                                    totalPaid,
                                                remainingAmount:
                                                    remainingAmount
                                            });
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    addPayment,
    getPayments,
    getPaymentById,
    getPaymentsByOrder,
    updatePayment,
    deletePayment
};