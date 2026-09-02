import "../App.css";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const [searchValue, setSearchValue] = useState("");
    const [searchMessage, setSearchMessage] = useState("");

    const authHeaders = (includeJson = false) => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };

        if (includeJson) {
            headers["Content-Type"] = "application/json";
        }

        return headers;
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${API_URL}/customers`, {
                headers: authHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch customers");
            }

            setCustomers(data.customers || []);
        } catch (error) {
            console.error("Error fetching customers:", error);
            setSearchMessage(error.message);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSearch = async () => {
        const value = searchValue.trim();

        if (!value) {
            setSearchMessage("");
            fetchCustomers();
            return;
        }

        try {
            const isPhone = /^\d+$/.test(value);

            const query = isPhone
                ? `phone=${encodeURIComponent(value)}`
                : `name=${encodeURIComponent(value)}`;

            const response = await fetch(
                `${API_URL}/customers/search?${query}`,
                {
                    headers: authHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to search customer");
            }

            const results = data.customers || [];
            setCustomers(results);

            if (results.length === 0) {
                setSearchMessage("No customer found.");
            } else {
                setSearchMessage("");
            }
        } catch (error) {
            console.error("Customer search error:", error);
            setCustomers([]);
            setSearchMessage(error.message);
        }
    };

    const handleClearSearch = () => {
        setSearchValue("");
        setSearchMessage("");
        fetchCustomers();
    };

    const handleUpdate = async () => {
        if (!editingCustomer) return;

        try {
            const response = await fetch(
                `${API_URL}/customers/${editingCustomer.id}`,
                {
                    method: "PUT",
                    headers: authHeaders(true),
                    body: JSON.stringify(editingCustomer)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update customer");
            }

            setCustomers((prevCustomers) =>
                prevCustomers.map((customer) =>
                    customer.id === editingCustomer.id
                        ? editingCustomer
                        : customer
                )
            );

            setEditingCustomer(null);
            setSearchMessage("Customer updated successfully!");
        } catch (error) {
            console.error("Error updating customer:", error);
            setSearchMessage(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/customers/${id}`,
                {
                    method: "DELETE",
                    headers: authHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete customer");
            }

            setCustomers((prevCustomers) =>
                prevCustomers.filter((customer) => customer.id !== id)
            );

            setSearchMessage("Customer deleted successfully!");
        } catch (error) {
            console.error("Error deleting customer:", error);
            setSearchMessage(error.message);
        }
    };

    return (
        <div className="customers-page">
            <h1>Customers</h1>

            <div className="customer-search">
                <input
                    type="text"
                    placeholder="Search by customer name or phone"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />

                <button type="button" onClick={handleSearch}>
                    Search
                </button>

                <button type="button" onClick={handleClearSearch}>
                    Clear
                </button>
            </div>

            {searchMessage && (
                <p className="customer-message">{searchMessage}</p>
            )}

            {editingCustomer && (
                <div className="edit-form">
                    <h2>Edit Customer</h2>

                    <input
                        type="text"
                        value={editingCustomer.name || ""}
                        onChange={(e) =>
                            setEditingCustomer({
                                ...editingCustomer,
                                name: e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        value={editingCustomer.phone || ""}
                        onChange={(e) =>
                            setEditingCustomer({
                                ...editingCustomer,
                                phone: e.target.value
                            })
                        }
                    />

                    <input
                        type="email"
                        value={editingCustomer.email || ""}
                        onChange={(e) =>
                            setEditingCustomer({
                                ...editingCustomer,
                                email: e.target.value
                            })
                        }
                    />

                    <textarea
                        value={editingCustomer.address || ""}
                        onChange={(e) =>
                            setEditingCustomer({
                                ...editingCustomer,
                                address: e.target.value
                            })
                        }
                    />

                    <button type="button" onClick={handleUpdate}>
                        Update Customer
                    </button>

                    <button
                        type="button"
                        onClick={() => setEditingCustomer(null)}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {customers.length === 0 ? (
                <p>No customers found.</p>
            ) : (
                customers.map((customer) => (
                    <div key={customer.id} className="customer-card">
                        <h3>{customer.name}</h3>
                        <p>{customer.phone}</p>
                        <p>{customer.email || "-"}</p>
                        <p>{customer.address || "-"}</p>

                        <button
                            type="button"
                            onClick={() => setEditingCustomer(customer)}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDelete(customer.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Customers;
