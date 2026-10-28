const db = require("../config/db");

exports.createNotification = (req, res) => {
const {
    customerName,
    mobileNumber,
    messageType,
    message,
} = req.body;

if (!customerName || !mobileNumber || !messageType || !message) {
    return res.status(400).json({
    success: false,
    message: "Please fill in all fields.",
});
}

const sql = `
    INSERT INTO notifications
    (customer_name, mobile_number, message_type, message)
    VALUES (?, ?, ?, ?)
`;

db.query(
    sql,
    [customerName, mobileNumber, messageType, message],
    (err, result) => {
    if (err) {
        console.error("Notification save error:", err.message);

        return res.status(500).json({
        success: false,
        message: "Unable to save notification.",
        });
    }

    res.status(201).json({
        success: true,
        message: "Notification saved successfully!",
        notificationId: result.insertId,
    });
    }
);
};

exports.getNotifications = (req, res) => {
const sql = `
    SELECT * FROM notifications
    ORDER BY created_at DESC
`;

db.query(sql, (err, results) => {
    if (err) {
    console.error("Notification history error:", err.message);
    return res.status(500).json({
        success: false,
        message: "Unable to fetch notification history.",
    });
    }

    res.status(200).json({
    success: true,
    notifications: results,
    });
});
};