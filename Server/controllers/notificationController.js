
const db = require("../config/db");

// CREATE NOTIFICATION
exports.createNotification = async (req, res) => {
    try {
        const {
            customerName,
            mobileNumber,
            messageType,
            message
        } = req.body;

        if (!customerName || !mobileNumber || !messageType || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        if (!/^[6-9]\d{9}$/.test(String(mobileNumber).trim())) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number."
            });
        }

        const sql = `
            INSERT INTO notifications
            (customer_name, mobile_number, message_type, message)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            customerName.trim(),
            String(mobileNumber).trim(),
            messageType,
            message.trim()
        ]);

        return res.status(201).json({
            success: true,
            message: "Notification saved successfully!",
            notificationId: result.insertId
        });

    } catch (err) {
        console.error("Notification save error:", err);

        return res.status(500).json({
            success: false,
            message: "Unable to save notification.",
            error: err.message
        });
    }
};


// GET NOTIFICATION HISTORY
exports.getNotifications = async (req, res) => {
    try {
        const sql = `
            SELECT * FROM notifications
            ORDER BY created_at DESC
        `;

        const [results] = await db.execute(sql);

        return res.status(200).json({
            success: true,
            notifications: results
        });

    } catch (err) {
        console.error("Notification history error:", err);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch notification history.",
            error: err.message
        });
    }
};
