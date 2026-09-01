import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard() {
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchMessage, setSearchMessage] = useState("");
    const [orders, setOrders] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [upcomingDeliveries, setUpcomingDeliveries] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState({
    totalOrderValue: 0,
    totalPaymentsReceived: 0,
    totalPendingAmount: 0
});
    useEffect(() => {
    fetch("http://localhost:5000/api/orders")
        .then((response) => response.json())
        .then((data) => {
            console.log("Dashboard Orders:", data);
            setOrders(data.orders || []);
        })
        .catch((error) => {
            console.error("Error fetching dashboard orders:", error);
        });
}, []);
    useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/recent-orders")
        .then((response) => response.json())
        .then((data) => {
            console.log("Recent Orders:", data);
            setRecentOrders(data.orders || []);
        })
        .catch((error) => {
            console.error("Error fetching recent orders:", error);
        });
}, []);
    useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/upcoming-deliveries")
        .then((response) => response.json())
        .then((data) => {
            console.log("Upcoming Deliveries:", data);
            setUpcomingDeliveries(data.deliveries || []);
        })
        .catch((error) => {
            console.error("Error fetching upcoming deliveries:", error);
        });
}, []);
    useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/payment-summary")
        .then((response) => response.json())
        .then((data) => {
            console.log("Payment Summary:", data);

            if (data.success) {
                setPaymentSummary(data.paymentSummary);
            }
        })
        .catch((error) => {
            console.error("Error fetching payment summary:", error);
        });
}, []);

    const inProgress = orders.filter(
    (order) =>
        order.status === "Pending" ||
        order.status === "In Progress"
).length;

    const ready = orders.filter(
        (order) => order.status === "Ready"
    ).length;

    const overdue = orders.filter((order) => {
        const today = new Date();
        const deliveryDate = new Date(order.delivery_date);

        return (
            deliveryDate < today &&
            order.status !== "Ready" &&
            order.status !== "Delivered"
        );
    }).length;

    const navigate = useNavigate();
    const handleCustomerSearch = async () => {
    if (!searchValue.trim()) {
        setSearchMessage("Enter customer name or phone.");
        setSearchResults([]);
        return;
    }

    try {
        const isPhone = /^\d+$/.test(searchValue.trim());

        const query = isPhone
            ? `phone=${encodeURIComponent(searchValue.trim())}`
            : `name=${encodeURIComponent(searchValue.trim())}`;

        const response = await fetch(
            `http://localhost:5000/api/customers/search?${query}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to search customers"
            );
        }

        setSearchResults(data.customers || []);
        setSearchMessage("");

    } catch (error) {
        console.error("Customer search error:", error);
        setSearchResults([]);
        setSearchMessage(error.message);
    }
};
    return (
        <div className="dashboard">

        {/* DASHBOARD HEADER */}
        <header className="dashboard-header">
            <div>
            <p className="dashboard-label">SILAI MITRA</p>
            <h1>SMART STITCH</h1>
            <p>Modern Tools for Modern Tailors.</p>
            </div>
        </header>


        {/* 01 — QUICK CREATE */}
        <section className="quick-create">

            <div className="section-heading">
            <span>01</span>
            <h2>QUICK CREATE</h2>
            </div>

            <div className="quick-actions">
            <button onClick={() => navigate("/new-customer")}>
                    ＋ New Customer
            </button>
            <button onClick={() => window.location.href = "/order"}>
                    ＋ New Order
            </button>
            <button onClick={() => window.location.href = "/measurement"}>
                    ＋ Add Measurement
            </button>
            <button onClick={() => navigate("/payment")}>
                ＋ Add Payment
            </button>
            </div>

        </section> 

        {/* 02 — ORDER RADAR */}
        <section className="order-radar">

            <div className="section-heading">
            <span>02</span>
            <h2>ORDER RADAR</h2>
            </div>

            <div className="order-stats">

            <div className="order-stat">
                <strong>{inProgress}</strong>
                <span>IN PROGRESS</span>
            </div>

            <div className="order-stat">
                <strong>{ready}</strong>
                <span>READY</span>
            </div>

            <div className="order-stat">
                <strong>{overdue}</strong>
                <span>OVERDUE</span>
            </div>

            </div>

        </section>


        {/* 03 — STYLE BOARD */}
        <section className="style-board">

            <div className="section-heading">
            <span>03</span>
            <h2>STYLE BOARD</h2>
            </div>

            <div className="style-categories">

            <div className="style-card">
                <span className="style-icon">👗</span>
                <h3>LEHENGA</h3>
                <p>08 designs</p>
            </div>

            <div className="style-card">
                <span className="style-icon">👔</span>
                <h3>SHIRT</h3>
                <p>12 designs</p>
            </div>

            <div className="style-card">
                <span className="style-icon">🥻</span>
                <h3>SAREE</h3>
                <p>06 designs</p>
            </div>

            <div className="style-card">
                <span className="style-icon">✦</span>
                <h3>CUSTOM</h3>
                <p>04 designs</p>
            </div>

            </div>

        </section>


        {/* 04 — RECENT ACTIVITY */}
        <section className="recent-activity">

            <div className="section-heading">
            <span>04</span>
            <h2>RECENT ACTIVITY</h2>
            </div>

            <div className="activity-list">

            {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                    <div className="activity-item" key={order.orderId}>
                        <span className="activity-dot">✦</span>

                        <div>
                            <strong>
                                New {order.garmentType} order from {order.customerName}
                            </strong>

                            <p>
                                Status: {order.status}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No recent activity found.</p>
            )}
            </div>

            <section className="upcoming-deliveries">
    <div className="section-heading">
        <span>05</span>
        <h2>UPCOMING DELIVERIES</h2>
    </div>

    <div className="delivery-list">
        {upcomingDeliveries.length > 0 ? (
            upcomingDeliveries.map((delivery) => (
                <div className="delivery-item" key={delivery.orderId}>
                    <div>
                        <strong>
                            {delivery.customerName} — {delivery.garmentType}
                        </strong>

                        <p>
                            Qty: {delivery.quantity} | Status: {delivery.status}
                        </p>
                    </div>

                    <span>
                        {new Date(delivery.deliveryDate).toLocaleDateString()}
                    </span>
                </div>
            ))
        ) : (
            <p>No upcoming deliveries.</p>
        )}
    </div>
</section>


        </section>

        </div>
    );
}

export default Dashboard;