import "../App.css";
import { useState, useEffect } from "react";

function Order() {
    const authHeaders = (includeJson = false) => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        if (includeJson) headers["Content-Type"] = "application/json";
        return headers;
    };

    const [customerId, setCustomerId] = useState("");
    const [measurementId, setMeasurementId] = useState("");
    const [garmentType, setGarmentType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [advanceAmount, setAdvanceAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState("");
    const [orders, setOrders] = useState([]);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [measurements, setMeasurements] = useState([]);

    // Get existing orders
    useEffect(() => {
        fetch("http://localhost:5000/api/orders", { headers: authHeaders() })
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch orders"
                    );
                }

                return data;
            })
            .then((data) => {
                console.log("Orders:", data);
                setOrders(data.orders || []);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    }, []);
    useEffect(() => {
    fetch("http://localhost:5000/api/customers", { headers: authHeaders() })
        .then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch customers"
                );
            }

            return data;
        })
        .then((data) => {
            console.log("Customers:", data);
            setCustomers(data.customers || []);
        })
        .catch((error) => {
            console.error("Error fetching customers:", error);
        });
}, []);
    const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
        return;
    }

    fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    })
        .then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete order"
                );
            }

            return data;
        })
        .then(() => {
            setMessage("Order deleted successfully!");

            setOrders((previousOrders) =>
                previousOrders.filter(
                    (order) => order.id !== id
                )
            );
        })
        .catch((error) => {
            console.error("Error deleting order:", error);
            setMessage(error.message);
        });
};

const handleUpdate = (e) => {
    e.preventDefault();

    const orderData = {
        customer_id: customerId,
        measurement_id: measurementId,
        garment_type: garmentType,
        quantity: quantity,
        delivery_date: deliveryDate,
        total_amount: totalAmount,
        advance_amount: advanceAmount,
        notes: notes
    };

    fetch(`http://localhost:5000/api/orders/${editingOrderId}`, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify(orderData)
    })
        .then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update order"
                );
            }

            return data;
        })
        .then(() => {
            setMessage("Order updated successfully!");
            setEditingOrderId(null);

            // Refresh orders
            return fetch("http://localhost:5000/api/orders", { headers: authHeaders() });
        })
        .then((response) => response.json())
        .then((data) => {
            setOrders(data.orders || []);
        })
        .catch((error) => {
            console.error("Error updating order:", error);
            setMessage(error.message);
        });
};

    // Create new order
    const handleSubmit = (e) => {
        e.preventDefault();

        const orderData = {
            customer_id: customerId,
            measurement_id: measurementId,
            garment_type: garmentType,
            quantity: quantity,
            delivery_date: deliveryDate,
            total_amount: totalAmount,
            advance_amount: advanceAmount,
            notes: notes
        };

        console.log("ORDER DATA:", orderData);

        fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify(orderData)
        })
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to create order"
                    );
                }

                return data;
            })
            .then((data) => {
                console.log("Order created:", data);

                setMessage("Order created successfully!");

                // Clear form
                setCustomerId("");
                setMeasurementId("");
                setGarmentType("");
                setQuantity("");
                setDeliveryDate("");
                setTotalAmount("");
                setAdvanceAmount("");
                setNotes("");

                // Add newly created order to the list
                if (data.order) {
                    setOrders((previousOrders) => [
                        data.order,
                        ...previousOrders
                    ]);
                } else {
                    // Refresh orders if backend doesn't return the order object
                    fetch("http://localhost:5000/api/orders", { headers: authHeaders() })
                        .then((response) => response.json())
                        .then((data) => {
                            setOrders(data.orders || []);
                        });
                }
            })
            .catch((error) => {
                console.error("Error creating order:", error);
                setMessage(error.message);
            });
    };

    return (
        <div className="order-page">

            {/* PAGE HEADER */}
            <header className="order-header">
                <p>SILAI MITRA</p>
                <h1>NEW ORDER</h1>
            </header>

            {/* ORDER FORM */}
            <form
                className="order-form"
                onSubmit={editingOrderId ? handleUpdate : handleSubmit}
            >

            <div className="form-group">
                <label>CUSTOMER</label>

                <select
                    value={customerId}
                    onChange={(e) => {
                        const selectedCustomerId = e.target.value;

                        setCustomerId(selectedCustomerId);
                        setMeasurementId("");
                        setGarmentType("");

                        if (!selectedCustomerId) {
                            setMeasurements([]);
                            return;
                        }

                        fetch(
                            `http://localhost:5000/api/measurements/customer/${selectedCustomerId}`,
                            { headers: authHeaders() }
                        )
                            .then((response) => response.json())
                            .then((data) => {
                                console.log("Customer Measurements:", data);
                                setMeasurements(data.measurements || []);
                            })
                            .catch((error) => {
                                console.error(
                                    "Error fetching measurements:",
                                    error
                                );
                            });
                    }}
                    required
                >
                    <option value="">Select customer</option>

                    {customers.map((customer) => (
                        <option
                            key={customer.id}
                            value={customer.id}
                        >
                            {customer.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>MEASUREMENT</label>

                <select
                    value={measurementId}
                    onChange={(e) => {
                        const selectedMeasurementId = e.target.value;

                        setMeasurementId(selectedMeasurementId);

                        const selectedMeasurement = measurements.find(
                            (measurement) =>
                                String(measurement.id) === selectedMeasurementId
                        );

                        if (selectedMeasurement) {
                            setGarmentType(selectedMeasurement.garment_type);
                        } else {
                            setGarmentType("");
                        }
                    }}
                    required
                    disabled={!customerId}
                >
                    <option value="">
                        {customerId
                            ? "Select measurement"
                            : "Select customer first"}
                    </option>

                    {measurements.map((measurement) => (
                        <option
                            key={measurement.id}
                            value={measurement.id}
                        >
                            {measurement.garment_type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>GARMENT TYPE</label>

                <input
                    type="text"
                    value={garmentType}
                    placeholder="Select measurement first"
                    readOnly
                />
            </div>

                <div className="form-group">
                    <label>QUANTITY</label>

                    <input
                        type="number"
                        placeholder="Enter quantity"
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>DELIVERY DATE</label>

                    <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) =>
                            setDeliveryDate(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>TOTAL AMOUNT</label>

                    <input
                        type="number"
                        placeholder="Enter total amount"
                        value={totalAmount}
                        onChange={(e) =>
                            setTotalAmount(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>ADVANCE AMOUNT</label>

                    <input
                        type="number"
                        placeholder="Enter advance amount"
                        value={advanceAmount}
                        onChange={(e) =>
                            setAdvanceAmount(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>NOTES</label>

                    <textarea
                        placeholder="Enter order notes"
                        value={notes}
                        onChange={(e) =>
                            setNotes(e.target.value)
                        }
                    ></textarea>
                </div>

                <button type="submit" className="save-order">
                    {editingOrderId ? "UPDATE ORDER →" : "SAVE ORDER →"}
                </button>

            </form>
            {message && <p>{message}</p>}

            {/* EXISTING ORDERS */}
            <div className="orders-list">

                <h2>EXISTING ORDERS</h2>

                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="order-card"
                        >
                            <p>
                                <strong>Order ID:</strong>{" "}
                                {order.id}
                            </p>

                            <p>
                                <strong>Customer:</strong>{" "}
                                {order.customer_name}
                            </p>

                            <p>
                                <strong>Garment:</strong>{" "}
                                {order.garment_type}
                            </p>

                            <p>
                                <strong>Quantity:</strong>{" "}
                                {order.quantity}
                            </p>

                            <p>
                                <strong>Total:</strong>{" "}
                                ₹{order.total_amount}
                            </p>

                            <p>
                                <strong>Advance:</strong>{" "}
                                ₹{order.advance_amount}
                            </p>

                            <p>
                                <strong>Remaining:</strong>{" "}
                                ₹{order.remaining_amount}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {order.status}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingOrderId(order.id);

                                    setCustomerId(String(order.customer_id));
                                    setQuantity(order.quantity);
                                    setDeliveryDate(
                                        order.delivery_date
                                            ? order.delivery_date.split("T")[0]
                                            : ""
                                    );
                                    setTotalAmount(order.total_amount);
                                    setAdvanceAmount(order.advance_amount);
                                    setNotes(order.notes || "");

                                    // Fetch measurements of this customer for edit
                                    fetch(
                                        `http://localhost:5000/api/measurements/customer/${order.customer_id}`,
                                        { headers: authHeaders() }
                                    )
                                        .then((response) => response.json())
                                        .then((data) => {
                                            setMeasurements(data.measurements || []);

                                            // Select the measurement already used in this order
                                            setMeasurementId(String(order.measurement_id));
                                            setGarmentType(order.garment_type);
                                        })
                                        .catch((error) => {
                                            console.error(
                                                "Error fetching measurements for edit:",
                                                error
                                            );
                                        });
                                }}
                            >
                                EDIT ORDER
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(order.id)}
                            >
                                DELETE ORDER
                            </button>
                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default Order;