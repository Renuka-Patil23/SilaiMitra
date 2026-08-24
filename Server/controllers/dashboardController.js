const db = require("../config/db");

// Get Dashboard Summary
const getDashboardSummary = (req, res) => {

    const query = `
        SELECT
            (SELECT COUNT(*) FROM customers) AS totalCustomers,

            (SELECT COUNT(*) FROM measurements) AS totalMeasurements,

            (SELECT COUNT(*) FROM orders) AS totalOrders,

            (SELECT COALESCE(SUM(total_amount), 0)
            FROM orders) AS totalOrderValue,

            (SELECT COALESCE(SUM(amount), 0)
            FROM payments) AS totalPaymentsReceived
    `;

    db.query(query, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get dashboard summary",
                error: err.message
            });
        }

        const summary = results[0];

        const totalOrderValue = Number(summary.totalOrderValue);
        const totalPaymentsReceived = Number(summary.totalPaymentsReceived);

        const totalPendingAmount =
            totalOrderValue - totalPaymentsReceived;

        res.status(200).json({
            success: true,
            summary: {
                totalCustomers: Number(summary.totalCustomers),
                totalMeasurements: Number(summary.totalMeasurements),
                totalOrders: Number(summary.totalOrders),
                totalOrderValue: totalOrderValue,
                totalPaymentsReceived: totalPaymentsReceived,
                totalPendingAmount: totalPendingAmount
            }
        });
    });
};

// Get Recent Orders
const getRecentOrders = (req, res) => {

    const query = `
        SELECT
            orders.id AS orderId,
            customers.name AS customerName,
            orders.garment_type AS garmentType,
            orders.quantity,
            orders.total_amount AS totalAmount,
            orders.remaining_amount AS remainingAmount,
            orders.status,
            orders.delivery_date AS deliveryDate,
            orders.order_date AS orderDate

        FROM orders

        INNER JOIN customers
            ON orders.customer_id = customers.id

        ORDER BY orders.created_at DESC

        LIMIT 5
    `;

    db.query(query, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get recent orders",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            orders: results
        });
    });
};

// GET UPCOMING DELIVERIES

const getUpcomingDeliveries = (req, res) => {

    const query = `
        SELECT
            orders.id AS orderId,
            customers.name AS customerName,
            customers.phone AS customerPhone,
            orders.garment_type AS garmentType,
            orders.quantity,
            orders.delivery_date AS deliveryDate,
            orders.status

        FROM orders

        INNER JOIN customers
            ON orders.customer_id = customers.id

        WHERE orders.delivery_date
            BETWEEN CURDATE()
            AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)

        AND orders.status NOT IN ('Delivered', 'Cancelled')

        ORDER BY orders.delivery_date ASC
    `;

    db.query(query, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get upcoming deliveries",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            deliveries: results
        });
    });
};


// =====================================================
// 4. GET PAYMENT SUMMARY
// =====================================================

const getPaymentSummary = (req, res) => {

    const query = `
        SELECT
            (SELECT COALESCE(SUM(amount), 0)
            FROM payments) AS totalPaymentsReceived,

            (SELECT COALESCE(SUM(total_amount), 0)
            FROM orders) AS totalOrderValue
    `;

    db.query(query, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get payment summary",
                error: err.message
            });
        }

        const summary = results[0];

        const totalPaymentsReceived =
            Number(summary.totalPaymentsReceived);

        const totalOrderValue =
            Number(summary.totalOrderValue);

        const totalPendingAmount =
            totalOrderValue - totalPaymentsReceived;

        res.status(200).json({
            success: true,
            paymentSummary: {
                totalOrderValue: totalOrderValue,
                totalPaymentsReceived: totalPaymentsReceived,
                totalPendingAmount: totalPendingAmount
            }
        });
    });
};


// =====================================================
// 5. GET CUSTOMER SUMMARY
// =====================================================

const getCustomerSummary = (req, res) => {

    const query = `
        SELECT
            (SELECT COUNT(*)
            FROM customers) AS totalCustomers,

            (SELECT COUNT(DISTINCT customer_id)
            FROM orders) AS customersWithOrders,

            (SELECT COUNT(DISTINCT customer_id)
            FROM measurements) AS customersWithMeasurements
    `;

    db.query(query, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get customer summary",
                error: err.message
            });
        }

        const summary = results[0];

        res.status(200).json({
            success: true,
            customerSummary: {
                totalCustomers: Number(summary.totalCustomers),
                customersWithOrders:
                    Number(summary.customersWithOrders),
                customersWithMeasurements:
                    Number(summary.customersWithMeasurements)
            }
        });
    });
};


// =====================================================
// EXPORT ALL DASHBOARD FUNCTIONS
// =====================================================

module.exports = {
    getDashboardSummary,
    getRecentOrders,
    getUpcomingDeliveries,
    getPaymentSummary,
    getCustomerSummary
};
