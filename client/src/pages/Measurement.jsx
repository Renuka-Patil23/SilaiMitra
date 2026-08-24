import { useState, useEffect } from "react";

function Measurement() {
    const [customerId, setCustomerId] = useState("");
    const [garmentType, setGarmentType] = useState("");
    const [chest, setChest] = useState("");
    const [waist, setWaist] = useState("");
    const [hip, setHip] = useState("");
    const [shoulder, setShoulder] = useState("");
    const [sleeve, setSleeve] = useState("");
    const [neck, setNeck] = useState("");
    const [length, setLength] = useState("");
    const [inseam, setInseam] = useState("");
    const [thigh, setThigh] = useState("");
    const [bottom, setBottom] = useState("");
    const [frontNeck, setFrontNeck] = useState("");
    const [backNeck, setBackNeck] = useState("");
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState("");
    const [measurements, setMeasurements] = useState([]);
    const [editingMeasurementId, setEditingMeasurementId] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerName, setSelectedCustomerName] = useState("");

    useEffect(() => {
    fetch("http://localhost:5000/api/measurements")
        .then(async (response) => {
            const data = await response.json();

    if (!response.ok) {
    console.log("MEASUREMENT BACKEND ERROR:", data);

    throw new Error(
        data.error || data.message || "Failed to add measurement"
    );
}

            return data;
        })
        .then((data) => {
            console.log("Measurements:", data);
            setMeasurements(data.measurements || []);
        })
        .catch((error) => {
            console.error("Error fetching measurements:", error);
        });
}, []);

    useEffect(() => {
    fetch("http://localhost:5000/api/customers")
        .then((response) => response.json())
        .then((data) => {
            console.log("Customers:", data);
            setCustomers(data.customers || []);
        })
        .catch((error) => {
            console.error("Error fetching customers:", error);
        });
}, []);

    const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this measurement?")) {
        return;
    }

    fetch(`http://localhost:5000/api/measurements/${id}`, {
        method: "DELETE"
    })
        .then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete measurement"
                );
            }

            return data;
        })
        .then(() => {
            setMessage("Measurement deleted successfully!");

            setMeasurements((previousMeasurements) =>
                previousMeasurements.filter(
                    (measurement) => measurement.id !== id
                )
            );
        })
        .catch((error) => {
            console.error("Error deleting measurement:", error);
            setMessage(error.message);
        });
};

    const handleUpdate = async (e) => {
    e.preventDefault();

    const measurementData = {
        customer_id: customerId,
        garment_type: garmentType,
        chest,
        waist,
        hip,
        shoulder,
        sleeve,
        neck,
        length,
        inseam,
        thigh,
        bottom,
        front_neck: frontNeck,
        back_neck: backNeck,
        notes
    };

    try {
        const response = await fetch(
            `http://localhost:5000/api/measurements/${editingMeasurementId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(measurementData)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to update measurement"
            );
        }

        setMessage("Measurement updated successfully!");
        setEditingMeasurementId(null);

        // Refresh measurements
        const refreshResponse = await fetch(
            "http://localhost:5000/api/measurements"
        );

        const refreshData = await refreshResponse.json();

        setMeasurements(refreshData.measurements || []);

    } catch (error) {
        console.error("Error updating measurement:", error);
        setMessage(error.message);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        const measurementData = {
            customer_id: customerId,
            garment_type: garmentType,

            chest: chest || null,
            waist: waist || null,
            hip: hip || null,
            shoulder: shoulder || null,
            sleeve: sleeve || null,
            neck: neck || null,
            length: length || null,
            inseam: inseam || null,
            thigh: thigh || null,
            bottom: bottom || null,
            front_neck: frontNeck || null,
            back_neck: backNeck || null,

            notes: notes
        };

        try {
            const response = await fetch(
                "http://localhost:5000/api/measurements",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(measurementData)
                }
            );

            const data = await response.json();
            console.log("FULL RESPONSE:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add measurement"
                );
            }

            setMessage("Measurement added successfully!");

            console.log("Measurement created:", data);

            // Clear form
            setCustomerId("");
            setGarmentType("");
            setChest("");
            setWaist("");
            setHip("");
            setShoulder("");
            setSleeve("");
            setNeck("");
            setLength("");
            setInseam("");
            setThigh("");
            setBottom("");
            setFrontNeck("");
            setBackNeck("");
            setNotes("");

        } catch (error) {
            console.error("Error adding measurement:", error);
            setMessage(error.message);
        }
    };

    return (
        <div className="measurement-page">

            <div className="measurement-header">
                <p>SILAI MITRA</p>
                <h1>NEW MEASUREMENT</h1>
            </div>

        <form
            className="measurement-form"
            onSubmit={
                editingMeasurementId ? handleUpdate : handleSubmit
            }
        >
        
        <div className="form-group">
            <label>CUSTOMER</label>

            <select
                value={customerId}
                onChange={(e) => {
                    const id = e.target.value;
                    setCustomerId(id);

                    const customer = customers.find(
                        (c) => String(c.id) === id
                    );

                    setSelectedCustomerName(
                        customer ? customer.name : ""
                    );
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
                    <label>GARMENT TYPE</label>
                <select
                        value={garmentType}
                        onChange={(e) => setGarmentType(e.target.value)}
                        required
                        >
                        <option value="">Select garment type</option>
                        <option value="Shirt">Shirt</option>
                        <option value="Blouse">Blouse</option>
                        <option value="Kurti">Kurti</option>
                        <option value="Lehenga">Lehenga</option>
                        <option value="Pant">Pant</option>
                        <option value="Custom">Custom</option>
                </select>
                </div>

                <div className="form-group">
                    <label>CHEST</label>
                    <input
                        type="number"
                        value={chest}
                        onChange={(e) => setChest(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>WAIST</label>
                    <input
                        type="number"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>HIP</label>
                    <input
                        type="number"
                        value={hip}
                        onChange={(e) => setHip(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>SHOULDER</label>
                    <input
                        type="number"
                        value={shoulder}
                        onChange={(e) => setShoulder(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>SLEEVE</label>
                    <input
                        type="number"
                        value={sleeve}
                        onChange={(e) => setSleeve(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>NECK</label>
                    <input
                        type="number"
                        value={neck}
                        onChange={(e) => setNeck(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>LENGTH</label>
                    <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>INSEAM</label>
                    <input
                        type="number"
                        value={inseam}
                        onChange={(e) => setInseam(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>THIGH</label>
                    <input
                        type="number"
                        value={thigh}
                        onChange={(e) => setThigh(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>BOTTOM</label>
                    <input
                        type="number"
                        value={bottom}
                        onChange={(e) => setBottom(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>FRONT NECK</label>
                    <input
                        type="number"
                        value={frontNeck}
                        onChange={(e) =>
                            setFrontNeck(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>BACK NECK</label>
                    <input
                        type="number"
                        value={backNeck}
                        onChange={(e) =>
                            setBackNeck(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>NOTES</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter notes"
                    />
                </div>

                <button type="submit">
                    {editingMeasurementId
                        ? "UPDATE MEASUREMENT"
                        : "SAVE MEASUREMENT"}
                </button>

            </form>

            {message && <p>{message}</p>}
            <div className="measurements-list">

                <h2>EXISTING MEASUREMENTS</h2>

                {measurements.length === 0 ? (
                    <p>No measurements found.</p>
                ) : (
                measurements.map((measurement) => {
                const customer = customers.find(
                    (c) => c.id === measurement.customer_id
                );

            return (
                        <div
                            key={measurement.id}
                            className="measurement-card"
                        >
                <p>
                <strong>Customer Name:</strong>{" "}
                {customer ? customer.name : "Unknown"}
                </p>
                <p><strong>ID:</strong> {measurement.id}</p>
                <p><strong>Customer ID:</strong> {measurement.customer_id}</p>
                <p><strong>Garment:</strong> {measurement.garment_type}</p>
                <p><strong>Chest:</strong> {measurement.chest}</p>
                <p><strong>Waist:</strong> {measurement.waist}</p>
                <p><strong>Hip:</strong> {measurement.hip}</p>
                <p><strong>Shoulder:</strong> {measurement.shoulder}</p>
                <p><strong>Sleeve:</strong> {measurement.sleeve}</p>
                <p><strong>Status:</strong> {measurement.status}</p>

                <button
                    type="button"
                    onClick={() => {
                        setEditingMeasurementId(measurement.id);
                        setCustomerId(measurement.customer_id);
                        setGarmentType(measurement.garment_type);
                        setChest(measurement.chest || "");
                        setWaist(measurement.waist || "");
                        setHip(measurement.hip || "");
                        setShoulder(measurement.shoulder || "");
                        setSleeve(measurement.sleeve || "");
                        setNeck(measurement.neck || "");
                        setLength(measurement.length || "");
                        setInseam(measurement.inseam || "");
                        setThigh(measurement.thigh || "");
                        setBottom(measurement.bottom || "");
                        setFrontNeck(measurement.front_neck || "");
                        setBackNeck(measurement.back_neck || "");
                        setNotes(measurement.notes || "");
                    }}
                >
                    EDIT MEASUREMENT
                </button>

                <button
                    type="button"
                    onClick={() => handleDelete(measurement.id)}
                >
                    DELETE MEASUREMENT
                </button>
            </div>
        );
    })
)}

</div>
        </div>
    );
}

export default Measurement;