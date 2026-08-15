import "../App.css";
import { useState } from "react";

function NewCustomer() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    const customerData = {
        name: name,
        phone: phone,
        email: email,
        address: address
    };

    const response = await fetch(
        "http://localhost:5000/api/customers",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customerData)
        }
    );

    const data = await response.json();

    console.log(data);
};
    return (
        <div className="new-customer">

            {/* PAGE HEADER */}
            <header className="customer-header">
                <p>SILAI MITRA</p>
                <h1>NEW CUSTOMER</h1>
            </header>

            {/* CUSTOMER FORM */}
            <form className="customer-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>CUSTOMER NAME</label>
                    <input
                        type="text"
                        placeholder="Enter customer name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>MOBILE NUMBER</label>
                    <input
                        type="tel"
                        placeholder="Enter mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>EMAIL</label>
                    <input
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>ADDRESS</label>
                    <textarea
                        placeholder="Enter customer address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    ></textarea>
                </div>

                <button type="submit" className="save-customer">
                    SAVE CUSTOMER →
                </button>

            </form>

        </div>
    );
}

export default NewCustomer;