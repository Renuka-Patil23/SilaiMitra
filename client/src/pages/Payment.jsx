import { useState } from "react";

function Payment() {
    const [orderId, setOrderId] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState("");

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
            const response = await fetch(
                "http://localhost:5000/api/payments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(paymentData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add payment"
                );
            }

            setMessage("Payment added successfully!");

            setOrderId("");
            setAmount("");
            setPaymentMethod("");
            setPaymentDate("");
            setNotes("");

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
                    <label>ORDER ID</label>
                    <input
                        type="number"
                        placeholder="Enter order ID"
                        value={orderId}
                        onChange={(e) =>
                            setOrderId(e.target.value)
                        }
                        required
                    />
                </div>

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
                    ADD PAYMENT →
                </button>

            </form>

        </div>
    );
}

export default Payment;