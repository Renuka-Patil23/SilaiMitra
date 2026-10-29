
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const fabricData = {
    Shirt: 1.6,
    Pant: 1.3,
    Kurta: 2.2,
    Blouse: 0.9,
    Dress: 2.5,
    Suit: 3.5,
    Jacket: 1.8,
};

const sizeFactors = {
    S: 0.9,
    M: 1,
    L: 1.1,
    XL: 1.2,
    XXL: 1.3,
};

const widthFactors = {
    "36": 1.25,
    "44": 1,
    "58": 0.82,
};


function TailoringDoodles() {
    const ink = "#A8D8C9";

    return (
        <div
            aria-label="Hand-drawn tailoring illustrations"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "clamp(16px, 4vw, 42px)",
                marginTop: "24px",
                padding: "12px 0 4px",
            }}
        >
            {/* Sewing machine */}
            <svg width="78" height="68" viewBox="0 0 90 75" fill="none"
                stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 57 L15 25 Q15 15 27 15 L49 15 Q59 15 59 26 L59 40 L44 40 L44 29 L30 29 L30 48 L70 48 L70 57 Z" />
                <path d="M9 60 Q42 56 77 60" />
                <path d="M19 65 L68 65 M27 48 L27 55 M60 48 L60 55" />
                <circle cx="49" cy="22" r="3" />
                <path d="M59 30 L65 30 L65 42 M43 40 L43 46 L49 46" />
                <path d="M32 20 L42 20" strokeDasharray="2 4" />
            </svg>

            {/* Measuring tape */}
            <svg width="70" height="68" viewBox="0 0 80 75" fill="none"
                stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20 C28 5 57 10 61 27 C66 43 52 60 34 58 C17 57 9 43 18 30 C24 21 39 21 45 30 C50 39 42 48 34 44 C28 41 30 34 35 33" />
                <path d="M19 25 L26 30 M24 19 L30 24 M33 16 L37 23 M43 16 L44 24 M52 21 L49 28 M58 31 L52 34 M56 42 L49 42 M47 52 L43 46" />
                <path d="M33 44 L28 51 L36 57" />
            </svg>

            {/* Scissors */}
            <svg width="72" height="68" viewBox="0 0 80 75" fill="none"
                stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="17" cy="18" r="8" />
                <circle cx="17" cy="47" r="8" />
                <path d="M23 23 L62 58 M23 42 L62 14" />
                <path d="M27 32 L65 36 M62 14 L70 10 M62 58 L70 63" />
                <circle cx="25" cy="32" r="2" />
            </svg>

            {/* Thread spool */}
            <svg width="68" height="68" viewBox="0 0 75 75" fill="none"
                stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 17 L51 17 L46 27 L46 52 L51 61 L23 61 L28 52 L28 27 Z" />
                <path d="M25 23 L49 23 M27 29 L47 29 M28 35 L46 35 M28 41 L46 41 M28 47 L46 47 M25 56 L49 56" />
                <path d="M37 17 C57 9 58 27 64 22" />
                <path d="M64 22 L68 18" />
            </svg>

            {/* Folded fabric */}
            <svg width="78" height="68" viewBox="0 0 90 75" fill="none"
                stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 27 L47 13 L76 27 L42 42 Z" />
                <path d="M13 27 L13 48 L42 64 L42 42" />
                <path d="M42 42 L76 27 L76 48 L42 64" />
                <path d="M25 22 L54 36 M35 18 L64 32 M22 48 L32 42 M52 48 L66 41" strokeDasharray="3 4" />
            </svg>
        </div>
    );
}

export default function FabricCalculator() {
    const navigate = useNavigate();
    const [garment, setGarment] = useState("Shirt");
    const [size, setSize] = useState("M");
    const [width, setWidth] = useState("44");
    const [quantity, setQuantity] = useState("1");

    const qty = Math.max(1, Math.min(1000, Number(quantity) || 1));
    const perGarment =
        Math.ceil(
            fabricData[garment] *
            sizeFactors[size] *
            widthFactors[width] *
            10
        ) / 10;

    const total = Math.ceil(perGarment * qty * 10) / 10;

    const styles = {
        page: {
            minHeight: "100vh",
            padding: "28px 18px 50px",
            background: "#F7F5EF",
            color: "#292F2C",
            fontFamily: "Arial, sans-serif",
            boxSizing: "border-box",
        },
        topbar: {
            maxWidth: "1050px",
            margin: "0 auto 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
        },
        brand: {
            color: "#0F766E",
            fontSize: "13px",
            fontWeight: "800",
            letterSpacing: "3px",
            margin: "0 0 5px",
        },
        back: {
            padding: "10px 16px",
            border: "1px solid #D6DED8",
            background: "#FFFFFF",
            borderRadius: "9px",
            color: "#28564F",
            cursor: "pointer",
            fontWeight: "600",
        },
        hero: {
            maxWidth: "1050px",
            margin: "0 auto 26px",
            padding: "30px",
            borderRadius: "20px",
            background: "#123F3A",
            color: "#FFFFFF",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
        },
        eyebrow: {
            color: "#A8D8C9",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "2px",
            textTransform: "uppercase",
        },
        title: {
            fontSize: "clamp(28px, 5vw, 42px)",
            lineHeight: 1.15,
            margin: "12px 0",
            fontWeight: "800",
        },
        subtitle: {
            color: "#D4E6DF",
            lineHeight: 1.7,
            maxWidth: "580px",
            margin: 0,
            fontSize: "15px",
        },
        layout: {
            maxWidth: "1050px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "22px",
            alignItems: "start",
        },
        card: {
            background: "#FFFFFF",
            border: "1px solid #E7E5DD",
            borderRadius: "17px",
            padding: "25px",
            boxSizing: "border-box",
            boxShadow: "0 8px 25px rgba(28, 55, 45, 0.04)",
        },
        heading: {
            fontSize: "20px",
            margin: "0 0 8px",
            color: "#243A34",
        },
        muted: {
            color: "#777F79",
            fontSize: "14px",
            lineHeight: 1.6,
            margin: "0 0 24px",
        },
        label: {
            display: "block",
            fontSize: "13px",
            fontWeight: "700",
            marginBottom: "9px",
            color: "#46544D",
        },
        field: {
            width: "100%",
            boxSizing: "border-box",
            padding: "13px 12px",
            border: "1px solid #D9DED8",
            borderRadius: "9px",
            background: "#FFFEFC",
            color: "#243A34",
            fontSize: "15px",
            outlineColor: "#0F766E",
        },
        fieldGroup: {
            marginBottom: "19px",
        },
        resultCard: {
            background: "#E9F4EE",
            border: "1px solid #CFE4D7",
            borderRadius: "13px",
            padding: "20px",
            marginTop: "20px",
        },
        resultLabel: {
            color: "#356A55",
            fontSize: "13px",
            fontWeight: "700",
            margin: "0 0 8px",
        },
        resultNumber: {
            fontSize: "clamp(28px, 4vw, 36px)",
            color: "#0F766E",
            fontWeight: "800",
            margin: 0,
        },
        totalCard: {
            background: "#123F3A",
            borderRadius: "13px",
            padding: "22px",
            marginTop: "12px",
            color: "#FFFFFF",
        },
        totalLabel: {
            fontSize: "13px",
            color: "#C5DED3",
            margin: "0 0 8px",
        },
        totalNumber: {
            fontSize: "36px",
            fontWeight: "800",
            margin: 0,
            color: "#FFFFFF",
        },
        tip: {
            marginTop: "18px",
            padding: "14px",
            background: "#FAF5E8",
            borderRadius: "10px",
            color: "#756443",
            fontSize: "12px",
            lineHeight: 1.7,
        },
        footer: {
            maxWidth: "1050px",
            margin: "22px auto 0",
            textAlign: "center",
            color: "#8A918B",
            fontSize: "12px",
        },
    };

    return (
        <main style={styles.page}>
            <header style={styles.topbar}>
                <div>
                    <p style={styles.brand}>SILAI MITRA</p>
                    <span style={{ color: "#7A827C", fontSize: "12px" }}>
                        TAILORING WORKSPACE
                    </span>
                </div>

                <button style={styles.back} onClick={() => navigate("/dashboard")}>
                    ← Back to Dashboard
                </button>
            </header>

            <section style={styles.hero}>
                <div style={styles.eyebrow}>✦ SMART TOOLS / 01</div>
                <h1 style={styles.title}>Smart Fabric Calculator</h1>
                <p style={styles.subtitle}>
                    Plan your fabric before you cut. Estimate material requirements
                    for different garments, sizes and order quantities in seconds.
                </p>
                <div
                    style={{
                        marginTop: "22px",
                        color: "#C5DED3",
                        fontSize: "13px",
                    }}
                >
                    ✂ Measure carefully. Cut confidently.
                </div>
                <TailoringDoodles />
            </section>

            <div style={styles.layout}>
                <section style={styles.card}>
                    <h2 style={styles.heading}>Fabric details</h2>
                    <p style={styles.muted}>
                        Choose your garment specifications to calculate an estimate.
                    </p>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label} htmlFor="garment">
                            GARMENT TYPE
                        </label>
                        <select
                            id="garment"
                            style={styles.field}
                            value={garment}
                            onChange={(e) => setGarment(e.target.value)}
                        >
                            {Object.keys(fabricData).map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label} htmlFor="size">
                            BODY SIZE
                        </label>
                        <select
                            id="size"
                            style={styles.field}
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        >
                            {Object.keys(sizeFactors).map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label} htmlFor="width">
                            FABRIC WIDTH
                        </label>
                        <select
                            id="width"
                            style={styles.field}
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                        >
                            <option value="36">36 inches</option>
                            <option value="44">44 inches</option>
                            <option value="58">58 inches</option>
                        </select>
                    </div>

                    <div style={{ ...styles.fieldGroup, marginBottom: 0 }}>
                        <label style={styles.label} htmlFor="quantity">
                            ORDER QUANTITY
                        </label>
                        <input
                            id="quantity"
                            style={styles.field}
                            type="number"
                            min="1"
                            max="1000"
                            step="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>
                </section>

                <section style={styles.card}>
                    <h2 style={styles.heading}>Your estimate</h2>
                    <p style={styles.muted}>
                        Your fabric requirement updates automatically when you change
                        the details.
                    </p>

                    <div style={styles.resultCard}>
                        <p style={styles.resultLabel}>FABRIC PER GARMENT</p>
                        <p style={styles.resultNumber}>{perGarment.toFixed(1)} m</p>
                        <p style={{ margin: "8px 0 0", color: "#66806F", fontSize: "12px" }}>
                            For one {garment.toLowerCase()}, size {size}
                        </p>
                    </div>

                    <div style={styles.totalCard}>
                        <p style={styles.totalLabel}>TOTAL ESTIMATED FABRIC</p>
                        <p style={styles.totalNumber}>{total.toFixed(1)} m</p>
                        <p style={{ color: "#C5DED3", fontSize: "13px", marginBottom: 0 }}>
                            {qty} garment{qty === 1 ? "" : "s"} · {width}-inch fabric
                        </p>
                    </div>

                    <div style={styles.tip}>
                        <strong>TAILOR'S NOTE</strong>
                        <br />
                        This is a rule-based estimate, not an exact cutting pattern.
                        Actual requirements depend on body measurements, design,
                        sleeves, lining, fabric shrinkage and cutting waste.
                        Confirm the quantity with your tailor before purchasing.
                    </div>
                </section>
            </div>

            <footer style={styles.footer}>
                SILAI MITRA · Thoughtful tools for better tailoring
            </footer>
        </main>
    );
}
