import { useEffect, useState } from "react";

function Payment() {
    const [orderId, setOrderId] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState("");
    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState("");
    const [orders, setOrders] = useState([]);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [payments, setPayments] = useState([]);
    const [editingPaymentId, setEditingPaymentId] = useState(null);

    useEffect(() => {
    const fetchData = async () => {
        try {
            // Customers
            const customerResponse = await fetch(
                "http://localhost:5000/api/customers"
            );
            const customerData = await customerResponse.json();

            // Orders
            const orderResponse = await fetch(
                "http://localhost:5000/api/orders"
            );
            const orderData = await orderResponse.json();

            // Payments
            const paymentResponse = await fetch(
                "http://localhost:5000/api/payments"
            );
            const paymentData = await paymentResponse.json();

            setCustomers(customerData.customers || []);
            setOrders(orderData.orders || []);
            setPayments(paymentData.payments || []);

        } catch (error) {
            console.error("Error loading payment data:", error);
        }
    };

    fetchData();
}, []);

    const handleCustomerChange = (e) => {
    const id = Number(e.target.value);

    setCustomerId(e.target.value);
    setOrderId("");
    setSelectedOrder(null);

    const filtered = orders.filter(
        (order) => Number(order.customer_id) === id
    );

    setCustomerOrders(filtered);
};
    const handleDeletePayment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/payments/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to delete payment"
            );
        }

        setMessage("Payment deleted successfully!");

        setPayments((previousPayments) =>
            previousPayments.filter(
                (payment) => payment.id !== id
            )
        );

    } catch (error) {
        console.error("Error deleting payment:", error);
        setMessage(error.message);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        const paymentData = {
            order_id: orderId,
            amount: amount,
            payment_method: paymentMethod,
            payment_date: paymentDate,
            notes: notes
        };

        try {
            const url = editingPaymentId
                ? `http://localhost:5000/api/payments/${editingPaymentId}`
                : "http://localhost:5000/api/payments";

            const method = editingPaymentId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add payment"
                );
            }

            setMessage(
                editingPaymentId
                    ? "Payment updated successfully!"
                    : "Payment added successfully!"
            );
            setEditingPaymentId(null);

            setOrderId("");
            setAmount("");
            setPaymentMethod("");
            setPaymentDate("");
            setNotes("");

            const paymentResponse = await fetch(
                "http://localhost:5000/api/payments"
            );

            const paymentsData = await paymentResponse.json();

            setPayments(paymentsData.payments || []);

        } catch (error) {
            console.error("Error adding payment:", error);
            setMessage(error.message);
        }
    };

    return (
        <div className="payment-page">

            <header className="payment-header">
                <p>SILAI MITRA</p>
                <h1>ADD PAYMENT</h1> 
            </header>

            {message && <p>{message}</p>}

            <form
                className="payment-form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">
                    <label>CUSTOMER</label>

                    <select
                        value={customerId}
                        onChange={handleCustomerChange}
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
                    <label>ORDER</label>

                    <select
                        value={orderId}
                        onChange={(e) => {
                            const id = e.target.value;

                            setOrderId(id);

                            const order = customerOrders.find(
                                (item) => String(item.id) === id
                            );

                            setSelectedOrder(order || null);
                        }}
                        disabled={!customerId}
                        required
                    >
                        <option value="">
                            {customerId
                                ? "Select order"
                                : "Select customer first"}
                        </option>

                        {customerOrders.map((order) => (
                            <option
                                key={order.id}
                                value={order.id}
                            >
                                {order.garment_type} — ₹{order.total_amount}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedOrder && (
                        <div className="payment-order-details">
                            <p><strong>Garment:</strong> {selectedOrder.garment_type}</p>
                            <p><strong>Total Amount:</strong> ₹{selectedOrder.total_amount}</p>
                            <p><strong>Advance:</strong> ₹{selectedOrder.advance_amount}</p>
                            <p><strong>Remaining:</strong> ₹{selectedOrder.remaining_amount}</p>
                            <p><strong>Status:</strong> {selectedOrder.status}</p>
                        </div>
                    )}

                <div className="form-group">
                    <label>AMOUNT</label>
                    <input
                        type="number"
                        placeholder="Enter payment amount"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label>PAYMENT METHOD</label>

                    <select
                        value={paymentMethod}
                        onChange={(e) =>
                            setPaymentMethod(e.target.value)
                        }
                        required
                    >
                        <option value="">
                            Select payment method
                        </option>
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>PAYMENT DATE</label>
                    <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) =>
                            setPaymentDate(e.target.value)
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label>NOTES</label>
                    <textarea
                        placeholder="Enter payment notes"
                        value={notes}
                        onChange={(e) =>
                            setNotes(e.target.value)
                        }
                    />     
                </div>

                <button type="submit">
                    {editingPaymentId ? "UPDATE PAYMENT →" : "ADD PAYMENT →"}
                </button>

            </form>
            <div className="payments-list">

    <h2>PAYMENT HISTORY</h2>

    {payments.length === 0 ? (
        <p>No payments found.</p>
    ) : (
        payments.map((payment) => (
            <div
                key={payment.id}
                className="payment-card"
            >
                <p>
                    <strong>Payment ID:</strong>{" "}
                    {payment.id}
                </p>

                <p>
                    <strong>Order ID:</strong>{" "}
                    {payment.order_id}
                </p>

                <p>
                    <strong>Amount:</strong>{" "}
                    ₹{payment.amount}
                </p>

                <p>
                    <strong>Method:</strong>{" "}
                    {payment.payment_method}
                </p>

                <p>
                    <strong>Date:</strong>{" "}
                    {payment.payment_date
                        ? payment.payment_date.split("T")[0]
                        : "-"}
                </p>

                <p>
                    <strong>Notes:</strong>{" "}
                    {payment.notes || "-"}
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setEditingPaymentId(payment.id);

                        setOrderId(String(payment.order_id));
                        setAmount(payment.amount);
                        setPaymentMethod(payment.payment_method);
                        setPaymentDate(
                            payment.payment_date
                                ? payment.payment_date.split("T")[0]
                                : ""
                        );
                        setNotes(payment.notes || "");

                        const relatedOrder = orders.find(
                            (order) => Number(order.id) === Number(payment.order_id)
                        );

                        if (relatedOrder) {
                            setCustomerId(String(relatedOrder.customer_id));

                            const filteredOrders = orders.filter(
                                (order) =>
                                    Number(order.customer_id) ===
                                    Number(relatedOrder.customer_id)
                            );

                            setCustomerOrders(filteredOrders);
                            setSelectedOrder(relatedOrder);
                        }
                    }}
                >
                    EDIT PAYMENT
                </button>
                <button
                    type="button"
                    onClick={() => handleDeletePayment(payment.id)}
                >
                    DELETE PAYMENT
                </button>
            </div>
        ))
    )}

</div>
        </div>
    );
}

export default Payment;