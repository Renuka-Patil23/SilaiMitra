import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [upcomingDeliveries, setUpcomingDeliveries] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState({
        totalOrderValue: 0,
        totalPaymentsReceived: 0,
        totalPendingAmount: 0
    });

    const navigate = useNavigate();

    const authHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`
    });

    const readJson = async (response, fallbackMessage) => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || fallbackMessage);
        }
        return data;
    };

    useEffect(() => {
        fetch(`${API_URL}/orders`, { headers: authHeaders() })
            .then((response) => readJson(response, "Failed to fetch dashboard orders"))
            .then((data) => {
                console.log("Dashboard Orders:", data);
                setOrders(data.orders || []);
            })
            .catch((error) => {
                console.error("Error fetching dashboard orders:", error);
            });
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/dashboard/recent-orders`, { headers: authHeaders() })
            .then((response) => readJson(response, "Failed to fetch recent orders"))
            .then((data) => {
                console.log("Recent Orders:", data);
                setRecentOrders(data.orders || []);
            })
            .catch((error) => {
                console.error("Error fetching recent orders:", error);
            });
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/dashboard/upcoming-deliveries`, { headers: authHeaders() })
            .then((response) => readJson(response, "Failed to fetch upcoming deliveries"))
            .then((data) => {
                console.log("Upcoming Deliveries:", data);
                setUpcomingDeliveries(data.deliveries || []);
            })
            .catch((error) => {
                console.error("Error fetching upcoming deliveries:", error);
            });
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/dashboard/payment-summary`, { headers: authHeaders() })
            .then((response) => readJson(response, "Failed to fetch payment summary"))
            .then((data) => {
                console.log("Payment Summary:", data);
                if (data.success) {
                    setPaymentSummary(data.paymentSummary || {
                        totalOrderValue: 0,
                        totalPaymentsReceived: 0,
                        totalPendingAmount: 0
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching payment summary:", error);
            });
    }, []);

    const inProgress = orders.filter(
        (order) => order.status === "Pending" || order.status === "In Progress"
    ).length;

    const ready = orders.filter((order) => order.status === "Ready").length;

    const overdue = orders.filter((order) => {
        if (!order.delivery_date) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deliveryDate = new Date(order.delivery_date);
        deliveryDate.setHours(0, 0, 0, 0);

        return (
            deliveryDate < today &&
            order.status !== "Ready" &&
            order.status !== "Delivered"
        );
    }).length;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <p className="dashboard-label">SILAI MITRA</p>
                    <h1>SMART STITCH</h1>
                    <p>Modern Tools for Modern Tailors.</p>
                </div>
            </header>

            <section className="quick-create">
                <div className="section-heading">
                    <span>01</span>
                    <h2>QUICK CREATE</h2>
                </div>

                <div className="quick-actions">
                    <button onClick={() => navigate("/new-customer")}>＋ New Customer</button>
                    <button onClick={() => navigate("/order")}>＋ New Order</button>
                    <button onClick={() => navigate("/measurement")}>＋ Add Measurement</button>
                    <button onClick={() => navigate("/payment")}>＋ Add Payment</button>
                </div>
            </section>

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
                                    <p>Status: {order.status}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No recent activity found.</p>
                    )}
                </div>
            </section>

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
                                    {delivery.deliveryDate
                                        ? new Date(delivery.deliveryDate).toLocaleDateString()
                                        : "-"}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p>No upcoming deliveries.</p>
                    )}
                </div>
            </section>

            <section className="payment-summary">
                <div className="section-heading">
                    <span>06</span>
                    <h2>PAYMENT SUMMARY</h2>
                </div>

                <div className="payment-stats">
                    <div className="payment-stat">
                        <strong>₹{paymentSummary.totalOrderValue || 0}</strong>
                        <span>TOTAL ORDER VALUE</span>
                    </div>
                    <div className="payment-stat">
                        <strong>₹{paymentSummary.totalPaymentsReceived || 0}</strong>
                        <span>PAYMENTS RECEIVED</span>
                    </div>
                    <div className="payment-stat">
                        <strong>₹{paymentSummary.totalPendingAmount || 0}</strong>
                        <span>PENDING AMOUNT</span>
                    </div>
                </div>
            </section>


            <section className="customers-section">
                <div className="section-heading">
                    <span>07</span>
                    <h2>CUSTOMERS</h2>
                </div>

                <div className="customers-dashboard-action">
                    <p>View, search and manage your existing customers.</p>
                    <button onClick={() => navigate("/customers")}>
                        👥 View Customers
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
