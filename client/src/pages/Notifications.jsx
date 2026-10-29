import React, { useState, useEffect } from "react";

export default function Notifications() {
const [customerName, setCustomerName] = useState("");
const [mobileNumber, setMobileNumber] = useState("");
const [customers, setCustomers] = useState([]);
const [selectedCustomerId, setSelectedCustomerId] = useState("");
const [messageType, setMessageType] = useState("Order Confirmation");
const [message, setMessage] = useState(
    "Your tailoring order has been confirmed. Thank you for choosing SMART STITCH!",
);
const [status, setStatus] = useState("");
const [loading, setLoading] = useState(false);
const [notifications, setNotifications] = useState([]);
const [historyLoading, setHistoryLoading] = useState(true);

useEffect(() => {
const fetchCustomers = async () => {
    try {
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:5000/api/customers",
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    const data = await response.json();

    if (response.ok) {
        setCustomers(data.customers || []);
    }
    } catch (error) {
    console.error("Error fetching customers:", error);
    }
};

fetchCustomers();
}, []);


useEffect(() => {
const fetchNotifications = async () => {
    try {
    const response = await fetch(
        "http://localhost:5000/api/notifications"
    );
    const data = await response.json();

    if (response.ok && data.success) {
        setNotifications(data.notifications);
    }
    } catch (error) {
    console.error("Error fetching notification history:", error);
    } finally {
    setHistoryLoading(false);
    }
};

fetchNotifications();
}, []);

const templates = {
    "Order Confirmation":
    "Your tailoring order has been confirmed. Thank you for choosing SMART STITCH!",
    "Order Ready":
    "Good news! Your stitched garment is ready for collection. Thank you!",
    "Order Reminder":
    "Reminder: Your tailoring order is in progress. Please contact SMART STITCH for details.",
    "Payment Reminder":
    "This is a friendly reminder regarding your pending tailoring payment. Thank you!",
};

const handleMessageTypeChange = (type) => {
    setMessageType(type);
    setMessage(templates[type]);
    setStatus("");
};

const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");

    if (!customerName.trim() || !mobileNumber.trim() || !message.trim()) {
    setStatus("Please fill in all the fields.");
    return;
    }

    if (!/^[6-9]\d{9}$/.test(mobileNumber.trim())) {
    setStatus("Please enter a valid 10-digit Indian mobile number.");
    return;
    }

    try {
    setLoading(true);

    const response = await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        customerName: customerName.trim(),
        mobileNumber: mobileNumber.trim(),
        messageType,
        message: message.trim(),
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed.");
    }

    if (data.success) {
        setStatus(data.message || "Notification request successful!");
    } else {
        setStatus(data.message || "Unable to create notification.");
    }
    } catch (error) {
    console.error("Notification error:", error);
    setStatus(
        "Unable to connect to the server. Please check whether the backend is running.",
    );
    } finally {
    setLoading(false);
    }
};

return (
    <div style={styles.page}>
    <div style={styles.header}>
        <div>
        <h1 style={styles.heading}>SMS Notifications</h1>
        <p style={styles.subtitle}>
            Manage customer updates from SMART STITCH
        </p>
        </div>

        <div style={styles.icon}>✉</div>
    </div>

    <div style={styles.card}>
        <h2 style={styles.cardTitle}>Create Notification</h2>

        <p style={styles.description}>
        Prepare order updates and reminders for your customers.
        </p>

        <form onSubmit={handleSubmit}>

<label style={styles.label}>Select Customer</label>

<select
style={styles.input}
value={selectedCustomerId}
onChange={(event) => {
    const selected = customers.find(
    (customer) =>
        String(customer.id) === event.target.value
    );

    setSelectedCustomerId(event.target.value);
    setCustomerName(selected ? selected.name : "");
    setMobileNumber(
    selected ? String(selected.phone || "") : ""
    );
    setStatus("");
}}
>
<option value="">-- Select Customer --</option>

{customers.map((customer) => (
    <option key={customer.id} value={customer.id}>
    {customer.name} - {customer.phone}
    </option>
))}
</select>


        <label style={styles.label}>Mobile Number</label>
        <input
            style={styles.input}
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={mobileNumber}
            onChange={(event) =>
            setMobileNumber(
                event.target.value.replace(/\D/g, "").slice(0, 10),
            )
            }
            maxLength={10}
        />

        <label style={styles.label}>Notification Type</label>
        <select
            style={styles.input}
            value={messageType}
            onChange={(event) => handleMessageTypeChange(event.target.value)}
        >
            {Object.keys(templates).map((type) => (
            <option key={type} value={type}>
                {type}
            </option>
            ))}
        </select>

        <label style={styles.label}>Message</label>
        <textarea
            style={styles.textarea}
            placeholder="Enter your message"
            value={message}
            onChange={(event) => {
            setMessage(event.target.value);
            setStatus("");
            }}
        />

        <div style={styles.counter}>{message.length} characters</div>

    <button
            style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            }}
            type="submit"
            disabled={loading}
        >
            {loading ? "Processing..." : "Send Notification Request"}
        </button>
        </form>

        {status && (
        <div style={styles.status} role="status">
            {status}
        </div>
        )}
    </div>
    <div style={styles.card}>
<h2 style={styles.cardTitle}>Notification History</h2>

{historyLoading ? (
    <p>Loading notification history...</p>
) : notifications.length === 0 ? (
    <p>No notifications found.</p>
) : (
    
<div style={{ overflowX: "auto", width: "100%" }}>
<table style={styles.historyTable}>
    <thead>
    <tr>
        <th style={styles.tableHeader}>Customer</th>
        <th style={styles.tableHeader}>Mobile Number</th>
        <th style={styles.tableHeader}>Notification Type</th>
        <th style={styles.tableHeader}>Message</th>
        <th style={styles.tableHeader}>Date & Time</th>
    </tr>
    </thead>

    <tbody>
    {notifications.map((item) => (
        <tr key={item.id}>
        <td style={styles.tableCell}>{item.customer_name}</td>
        <td style={styles.tableCell}>{item.mobile_number}</td>
        <td style={styles.tableCell}>
            <span style={styles.typeBadge}>
            {item.message_type}
            </span>
        </td>
        <td style={styles.messageCell}>{item.message}</td>
        <td style={styles.tableCell}>
            {new Date(item.created_at).toLocaleString("en-IN")}
        </td>
        </tr>
    ))}
    </tbody>
</table>
</div>
)}
</div>
</div>
);
}

const styles = {
page: {
    maxWidth: "850px",
    margin: "30px auto",
    padding: "24px",
    color: "#243047",
    fontFamily: "Arial, sans-serif",
},
header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
},
heading: {
margin: "0 0 8px",
fontSize: "30px",
fontWeight: "700",
color: "#000000",
},
subtitle: {
    margin: 0,
    color: "#667085",
},
icon: {
    fontSize: "30px",
    background: "#e8efff",
    padding: "15px",
    borderRadius: "14px",
},
card: {
    background: "#ffffff",
    border: "1px solid #e1e7f0",
    borderRadius: "16px",
    padding: "26px",
    boxShadow: "0 6px 24px rgba(30, 50, 90, 0.06)",
},
cardTitle: {
margin: "0 0 8px",
fontSize: "22px",
color: "#000000",
},
description: {
    color: "#667085",
    marginBottom: "24px",
},
label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "18px",
    fontWeight: "600",
    fontSize: "14px",
},
input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #d0d7e2",
    borderRadius: "9px",
    fontSize: "15px",
    background: "#ffffff",
    color: "#243047",
},
textarea: {
    width: "100%",
    minHeight: "120px",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #d0d7e2",
    borderRadius: "9px",
    fontSize: "15px",
    fontFamily: "Arial, sans-serif",
    resize: "vertical",
},
counter: {
    textAlign: "right",
    color: "#667085",
    fontSize: "12px",
    marginTop: "6px",
},
button: {
    width: "100%",
    marginTop: "22px",
    padding: "13px",
    border: "none",
    borderRadius: "9px",
    background: "#3457d5",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
},
status: {
    marginTop: "18px",
    padding: "13px",
    background: "#eef4ff",
    color: "#2447a8",
    borderRadius: "9px",
    lineHeight: "1.5",
},
note: {
    marginTop: "18px",
    padding: "15px",
    borderRadius: "10px",
    background: "#fff8e8",
    color: "#72520a",
    fontSize: "14px",
    lineHeight: "1.6",
},

historyTable: {
width: "100%",
minWidth: "900px",
borderCollapse: "collapse",
tableLayout: "fixed",
backgroundColor: "#ffffff",
},
tableHeader: {
padding: "16px 12px",
backgroundColor: "#eef2ff",
color: "#3448a5",
textAlign: "left",
fontSize: "14px",
borderBottom: "2px solid #dbe3f5",
},
tableCell: {
padding: "16px 12px",
color: "#334155",
textAlign: "left",
fontSize: "14px",
verticalAlign: "top",
borderBottom: "1px solid #e2e8f0",
overflowWrap: "anywhere",
},
messageCell: {
padding: "16px 12px",
color: "#475569",
fontSize: "14px",
lineHeight: "1.6",
verticalAlign: "top",
borderBottom: "1px solid #e2e8f0",
overflowWrap: "anywhere",
},
typeBadge: {
display: "inline-block",
padding: "5px 9px",
backgroundColor: "#e0e7ff",
color: "#3730a3",
borderRadius: "6px",
fontSize: "12px",
fontWeight: "600",
},

};
