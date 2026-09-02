import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

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

    const getToken = () => localStorage.getItem("token");

    const authHeaders = (includeJson = false) => {
        const headers = {
            Authorization: `Bearer ${getToken()}`
        };

        if (includeJson) {
            headers["Content-Type"] = "application/json";
        }

        return headers;
    };

    const getErrorMessage = (data, fallbackMessage) => {
        if (Array.isArray(data?.errors) && data.errors.length > 0) {
            return data.errors
                .map((error) => error.msg || error.message || String(error))
                .join(", ");
        }

        if (typeof data?.error === "string") {
            return data.error;
        }

        if (typeof data?.message === "string") {
            return data.message;
        }

        return fallbackMessage;
    };

    const toNumberOrNull = (value) => {
        if (value === "" || value === null || value === undefined) {
            return null;
        }

        const number = Number(value);
        return Number.isNaN(number) ? null : number;
    };

    const clearForm = () => {
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
        setEditingMeasurementId(null);
    };

    const buildMeasurementData = () => ({
        customer_id: Number(customerId),
        garment_type: garmentType,
        chest: toNumberOrNull(chest),
        waist: toNumberOrNull(waist),
        hip: toNumberOrNull(hip),
        shoulder: toNumberOrNull(shoulder),
        sleeve: toNumberOrNull(sleeve),
        neck: toNumberOrNull(neck),
        length: toNumberOrNull(length),
        inseam: toNumberOrNull(inseam),
        thigh: toNumberOrNull(thigh),
        bottom: toNumberOrNull(bottom),
        front_neck: toNumberOrNull(frontNeck),
        back_neck: toNumberOrNull(backNeck),
        notes: notes.trim()
    });

    const fetchMeasurements = async () => {
        try {
            const response = await fetch(`${API_URL}/measurements`, {
                headers: authHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Failed to fetch measurements")
                );
            }

            console.log("Measurements:", data);
            setMeasurements(data.measurements || []);
        } catch (error) {
            console.error("Error fetching measurements:", error);
            setMessage(error.message);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${API_URL}/customers`, {
                headers: authHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Failed to fetch customers")
                );
            }

            console.log("Customers:", data);
            setCustomers(data.customers || []);
        } catch (error) {
            console.error("Error fetching customers:", error);
            setMessage(error.message);
        }
    };

    useEffect(() => {
        if (!getToken()) {
            setMessage("Please login first.");
            return;
        }

        fetchCustomers();
        fetchMeasurements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!customerId) {
            setMessage("Please select a customer.");
            return;
        }

        if (!garmentType) {
            setMessage("Please select a garment type.");
            return;
        }

        const measurementData = buildMeasurementData();

        try {
            const response = await fetch(`${API_URL}/measurements`, {
                method: "POST",
                headers: authHeaders(true),
                body: JSON.stringify(measurementData)
            });

            const data = await response.json();

            console.log("ADD MEASUREMENT RESPONSE:", data);

            if (!response.ok) {
                console.log("FULL VALIDATION ERROR:", data);
                throw new Error(
                    getErrorMessage(data, "Failed to add measurement")
                );
            }

            setMessage("Measurement added successfully!");
            clearForm();
            await fetchMeasurements();
        } catch (error) {
            console.error("Error adding measurement:", error);
            setMessage(error.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!editingMeasurementId) {
            return;
        }

        if (!customerId) {
            setMessage("Please select a customer.");
            return;
        }

        if (!garmentType) {
            setMessage("Please select a garment type.");
            return;
        }

        const measurementData = buildMeasurementData();

        try {
            const response = await fetch(
                `${API_URL}/measurements/${editingMeasurementId}`,
                {
                    method: "PUT",
                    headers: authHeaders(true),
                    body: JSON.stringify(measurementData)
                }
            );

            const data = await response.json();

            console.log("UPDATE MEASUREMENT RESPONSE:", data);

            if (!response.ok) {
                console.log("FULL UPDATE ERROR:", data);
                throw new Error(
                    getErrorMessage(data, "Failed to update measurement")
                );
            }

            setMessage("Measurement updated successfully!");
            clearForm();
            await fetchMeasurements();
        } catch (error) {
            console.error("Error updating measurement:", error);
            setMessage(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this measurement?")) {
            return;
        }

        setMessage("");

        try {
            const response = await fetch(`${API_URL}/measurements/${id}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Failed to delete measurement")
                );
            }

            setMessage("Measurement deleted successfully!");

            setMeasurements((previousMeasurements) =>
                previousMeasurements.filter(
                    (measurement) => measurement.id !== id
                )
            );
        } catch (error) {
            console.error("Error deleting measurement:", error);
            setMessage(error.message);
        }
    };

    const handleEdit = (measurement) => {
        setEditingMeasurementId(measurement.id);
        setCustomerId(String(measurement.customer_id ?? ""));
        setGarmentType(measurement.garment_type || "");
        setChest(measurement.chest ?? "");
        setWaist(measurement.waist ?? "");
        setHip(measurement.hip ?? "");
        setShoulder(measurement.shoulder ?? "");
        setSleeve(measurement.sleeve ?? "");
        setNeck(measurement.neck ?? "");
        setLength(measurement.length ?? "");
        setInseam(measurement.inseam ?? "");
        setThigh(measurement.thigh ?? "");
        setBottom(measurement.bottom ?? "");
        setFrontNeck(measurement.front_neck ?? "");
        setBackNeck(measurement.back_neck ?? "");
        setNotes(measurement.notes || "");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className="measurement-page">
            <div className="measurement-header">
                <p>SILAI MITRA</p>
                <h1>
                    {editingMeasurementId
                        ? "EDIT MEASUREMENT"
                        : "NEW MEASUREMENT"}
                </h1>
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
                        onChange={(e) => setCustomerId(e.target.value)}
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
                        <option value="Pant">Pant</option>
                        <option value="Kurta">Kurta</option>
                        <option value="Blouse">Blouse</option>
                        <option value="Dress">Dress</option>
                        <option value="Suit">Suit</option>
                        <option value="Jacket">Jacket</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>CHEST</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={chest}
                        onChange={(e) => setChest(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>WAIST</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>HIP</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={hip}
                        onChange={(e) => setHip(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>SHOULDER</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={shoulder}
                        onChange={(e) => setShoulder(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>SLEEVE</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={sleeve}
                        onChange={(e) => setSleeve(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>NECK</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={neck}
                        onChange={(e) => setNeck(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>LENGTH</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>INSEAM</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={inseam}
                        onChange={(e) => setInseam(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>THIGH</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={thigh}
                        onChange={(e) => setThigh(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>BOTTOM</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={bottom}
                        onChange={(e) => setBottom(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>FRONT NECK</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={frontNeck}
                        onChange={(e) => setFrontNeck(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>BACK NECK</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={backNeck}
                        onChange={(e) => setBackNeck(e.target.value)}
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

                {editingMeasurementId && (
                    <button
                        type="button"
                        onClick={() => {
                            clearForm();
                            setMessage("");
                        }}
                    >
                        CANCEL EDIT
                    </button>
                )}
            </form>

            {message && <p>{message}</p>}

            <div className="measurements-list">
                <h2>EXISTING MEASUREMENTS</h2>

                {measurements.length === 0 ? (
                    <p>No measurements found.</p>
                ) : (
                    measurements.map((measurement) => {
                        const customer = customers.find(
                            (item) =>
                                String(item.id) ===
                                String(measurement.customer_id)
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

                                <p>
                                    <strong>ID:</strong> {measurement.id}
                                </p>

                                <p>
                                    <strong>Customer ID:</strong>{" "}
                                    {measurement.customer_id}
                                </p>

                                <p>
                                    <strong>Garment:</strong>{" "}
                                    {measurement.garment_type}
                                </p>

                                <p>
                                    <strong>Chest:</strong>{" "}
                                    {measurement.chest ?? "-"}
                                </p>

                                <p>
                                    <strong>Waist:</strong>{" "}
                                    {measurement.waist ?? "-"}
                                </p>

                                <p>
                                    <strong>Hip:</strong>{" "}
                                    {measurement.hip ?? "-"}
                                </p>

                                <p>
                                    <strong>Shoulder:</strong>{" "}
                                    {measurement.shoulder ?? "-"}
                                </p>

                                <p>
                                    <strong>Sleeve:</strong>{" "}
                                    {measurement.sleeve ?? "-"}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {measurement.status ?? "-"}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => handleEdit(measurement)}
                                >
                                    EDIT MEASUREMENT
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(measurement.id)
                                    }
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
