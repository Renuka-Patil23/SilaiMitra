import "../App.css";
import { useEffect, useState } from "react";
function Customers(){
    const [customers, setCustomers] = useState([]);
    const [editingCustomer, setEditingCustomer] = useState(null);

    useEffect(() => {
    fetch("http://localhost:5000/api/customers")
        .then((response) => response.json())
        .then((data) => {
            setCustomers(data.customers);
        });
}, []);
const handleUpdate = async () => {
    const response = await fetch(
        `http://localhost:5000/api/customers/${editingCustomer.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editingCustomer)
        }
    );

    const data = await response.json();

    console.log(data);

    if (data.success) {
        setCustomers((prevCustomers) =>
            prevCustomers.map((customer) =>
                customer.id === editingCustomer.id
                    ? editingCustomer
                    : customer
            )
        );

        setEditingCustomer(null);
    }
};  const handleDelete = async (id) => {
    const response = await fetch(
        `http://localhost:5000/api/customers/${id}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    console.log(data);

    if (data.success) {
        setCustomers((prevCustomers) =>
            prevCustomers.filter((customer) => customer.id !== id)
        );
    }
};

return (
    <div className="customers-page">
        <h1>Customers</h1>
        {editingCustomer && (
    <div className="edit-form">
        <h2>Edit Customer</h2>

        <input
            type="text"
            value={editingCustomer.name}
            onChange={(e) =>
                setEditingCustomer({
                    ...editingCustomer,
                    name: e.target.value
                })
            }
        />

        <input
            type="text"
            value={editingCustomer.phone}
            onChange={(e) =>
                setEditingCustomer({
                    ...editingCustomer,
                    phone: e.target.value
                })
            }
        />

        <input
            type="email"
            value={editingCustomer.email}
            onChange={(e) =>
                setEditingCustomer({
                    ...editingCustomer,
                    email: e.target.value
                })
            }
        />

        <textarea
            value={editingCustomer.address}
            onChange={(e) =>
                setEditingCustomer({
                    ...editingCustomer,
                    address: e.target.value
                })
            }
        />

        <button onClick={handleUpdate}>
            Update Customer
        </button>

        <button onClick={() => setEditingCustomer(null)}>
            Cancel
        </button>
    </div>
)}

        {customers.map((customer) => (
            <div key={customer.id} className="customer-card">
                <h3>{customer.name}</h3>
                <p>{customer.phone}</p>
                <p>{customer.email}</p>
                <p>{customer.address}</p>
                <button onClick={() => setEditingCustomer(customer)}>
                        Edit
                </button>
                <button onClick={() => handleDelete(customer.id)}>
                        Delete
                </button>
            </div>
        ))}
    </div>
);
}

export default Customers;