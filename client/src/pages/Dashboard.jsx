import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard() {
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchMessage, setSearchMessage] = useState("");
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
            <h1>THE STITCH HQ</h1>
            <p>Your atelier. Your orders. Your craft.</p>
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
                <strong>12</strong>
                <span>IN PROGRESS</span>
            </div>

            <div className="order-stat">
                <strong>05</strong>
                <span>READY</span>
            </div>

            <div className="order-stat">
                <strong>03</strong>
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

            <div className="activity-item">
                <span className="activity-dot">✦</span>

                <div>
                <strong>Riya's measurements updated</strong>
                <p>2 minutes ago</p>
                </div>
            </div>


            <div className="activity-item">
                <span className="activity-dot">✦</span>

                <div>
                <strong>New order from Ananya</strong>
                <p>18 minutes ago</p>
                </div>
            </div>


            <div className="activity-item">
                <span className="activity-dot">✦</span>

                <div>
                <strong>Rahul's shirt marked ready</strong>
                <p>42 minutes ago</p>
                </div>
            </div>

            </div>

        </section>

        </div>
    );
}

export default Dashboard;