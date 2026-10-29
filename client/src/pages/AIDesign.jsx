
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const garments = {
    Ladies: {
        Kurta: {
            Casual: ["Simple Cotton Kurta", "Printed Kurta", "Straight-Cut Kurta"],
            Party: ["Embroidered Kurta", "Asymmetric Kurta", "Textured Designer Kurta"],
            Wedding: ["Royal Embroidered Kurta", "Silk Festive Kurta", "Traditional Designer Kurta"],
        },
        Blouse: {
            Casual: ["Round-Neck Blouse", "Printed Blouse", "Classic Sleeve Blouse"],
            Party: ["Boat-Neck Blouse", "Mirror-Work Blouse", "Designer Sleeve Blouse"],
            Wedding: ["Heavy Embroidered Blouse", "Traditional Silk Blouse", "Designer Back Blouse"],
        },
        Dress: {
            Casual: ["Floral Day Dress", "A-Line Dress", "Cotton Dress"],
            Party: ["Evening Dress", "Flared Party Dress", "Designer Party Dress"],
            Wedding: ["Embellished Dress", "Flowing Formal Dress", "Festive Designer Dress"],
        },
        Suit: {
            Casual: ["Simple Ladies Suit", "Cotton Salwar Suit", "Straight-Cut Suit"],
            Party: ["Designer Salwar Suit", "Anarkali Suit", "Embroidered Party Suit"],
            Wedding: ["Bridal Suit", "Heavy Embroidered Suit", "Festive Silk Suit"],
        },
        Pant: {
            Casual: ["Straight-Fit Trousers", "Relaxed-Fit Pants", "Classic Cotton Pants"],
            Party: ["Tailored Trousers", "Slim-Fit Pants", "Pleated Trousers"],
            Wedding: ["Formal Trousers", "Premium Tailored Pants", "Festive Trousers"],
        },
    },

    Gents: {
        Shirt: {
            Casual: ["Minimal Printed Shirt", "Solid Colour Shirt", "Checks Pattern Shirt"],
            Party: ["Satin Finish Shirt", "Dark Contrast Shirt", "Statement Collar Shirt"],
            Wedding: ["Embroidered Shirt", "Classic Festive Shirt", "Designer Cuff Shirt"],
        },
        Kurta: {
            Casual: ["Simple Cotton Kurta", "Printed Kurta", "Straight-Cut Kurta"],
            Party: ["Embroidered Kurta", "Asymmetric Kurta", "Textured Designer Kurta"],
            Wedding: ["Royal Embroidered Kurta", "Silk Festive Kurta", "Traditional Designer Kurta"],
        },
        Pant: {
            Casual: ["Straight-Fit Pants", "Relaxed-Fit Trousers", "Classic Cotton Pants"],
            Party: ["Tailored Trousers", "Slim-Fit Pants", "Pleated Trousers"],
            Wedding: ["Formal Pants", "Premium Tailored Trousers", "Festive Pants"],
        },
        Suit: {
            Casual: ["Lightweight Suit", "Simple Tailored Suit", "Two-Piece Suit"],
            Party: ["Slim-Fit Party Suit", "Textured Blazer Suit", "Modern Formal Suit"],
            Wedding: ["Classic Wedding Suit", "Three-Piece Suit", "Festive Tailored Suit"],
        },
        Jacket: {
            Casual: ["Minimal Casual Jacket", "Denim-Style Jacket", "Lightweight Jacket"],
            Party: ["Statement Jacket", "Textured Party Jacket", "Fitted Designer Jacket"],
            Wedding: ["Embroidered Jacket", "Traditional Occasion Jacket", "Premium Formal Jacket"],
        },
    },
};

const palette = {
    Black: "#252525",
    Blue: "#2563B9",
    Red: "#C83245",
    Green: "#23845A",
    Yellow: "#E5B52E",
    White: "#F5F1E8",
    Pink: "#E98BAF",
    Purple: "#8653B7",
};


function getImagePath(category, garment, colour, index) {
    return `/images/${category.toLowerCase()}-${garment.toLowerCase()}-${colour.toLowerCase()}-${index + 1}.jpg`;
}

function DesignPhoto({ category, garment, colour, index }) {
    const [imageFailed, setImageFailed] = useState(false);

    const imagePath = getImagePath(category, garment, colour, index);

    // Support the existing kurta-blue.jpg photo as a fallback.
    const oldKurtaPhoto =
        category === "Ladies" &&
        garment === "Kurta" &&
        colour === "Blue" &&
        index === 0;

    if (imageFailed) {
        return (
            <div style={styles.noPhoto}>
                <span style={{ fontSize: "32px" }}>📷</span>
                <p style={{ margin: "8px 0" }}>Design photo not added yet</p>
                {/* <small>Save the correct image in public/images</small> */}
            </div>
        );
    }

    return (
        <img
            src={imagePath}
            alt={`${category} ${colour} ${garment} design ${index + 1}`}
            style={styles.photo}
            onError={(event) => {
                if (oldKurtaPhoto && !event.currentTarget.dataset.fallback) {
                    event.currentTarget.dataset.fallback = "true";
                    event.currentTarget.src = "/images/kurta-blue.jpg";
                } else {
                    setImageFailed(true);
                }
            }}
        />
    );
}

export default function AIDesign() {
    const navigate = useNavigate();

    const [category, setCategory] = useState("Ladies");
    const [garment, setGarment] = useState("Kurta");
    const [occasion, setOccasion] = useState("Party");
    const [colour, setColour] = useState("Blue");
    const [showResults, setShowResults] = useState(false);

    const garmentOptions = Object.keys(garments[category]);
    const recommendations = garments[category][garment][occasion];

    function changeCategory(value) {
        setCategory(value);
        setGarment(Object.keys(garments[value])[0]);
        setShowResults(false);
    }

    return (
        <main style={styles.page}>
            <div style={styles.container}>
                <button
                    style={styles.back}
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>

                <header style={styles.hero}>
                    <div style={styles.tag}>SILAIMITRA · SMART TOOLS</div>
                    <h1 style={styles.title}>Smart Design Studio</h1>
                    <p>Discover outfit ideas for your next custom creation.</p>
                    <div style={styles.decor}>✂ 🧵 ✦ 🪡</div>
                </header>

                <section style={styles.panel}>
                    <h2 style={{ color: "#176E62" }}>Personalise Your Design</h2>
                    <p style={styles.muted}>
                        Select the customer category, garment, occasion and colour.
                    </p>

                    <label style={styles.label}>Customer Category</label>
                    <select
                        style={styles.select}
                        value={category}
                        onChange={(e) => changeCategory(e.target.value)}
                    >
                        <option value="Ladies">Ladies</option>
                        <option value="Gents">Gents</option>
                    </select>

                    <label style={styles.label}>Garment Type</label>
                    <select
                        style={styles.select}
                        value={garment}
                        onChange={(e) => {
                            setGarment(e.target.value);
                            setShowResults(false);
                        }}
                    >
                        {garmentOptions.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <label style={styles.label}>Occasion</label>
                    <select
                        style={styles.select}
                        value={occasion}
                        onChange={(e) => {
                            setOccasion(e.target.value);
                            setShowResults(false);
                        }}
                    >
                        <option value="Casual">Casual / Daily Wear</option>
                        <option value="Party">Party Wear</option>
                        <option value="Wedding">Wedding / Festive</option>
                    </select>

                    <label style={styles.label}>Preferred Colour</label>
                    <select
                        style={styles.select}
                        value={colour}
                        onChange={(e) => {
                            setColour(e.target.value);
                            setShowResults(false);
                        }}
                    >
                        {Object.keys(palette).map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <button
                        style={styles.generate}
                        onClick={() => setShowResults(true)}
                    >
                        ✨ Recommend Designs
                    </button>
                </section>

                {showResults && (
                    <section style={styles.results}>
                        <div style={styles.tagResult}>YOUR DESIGN MATCHES</div>
                        <h2>Recommended for You</h2>

                        <p style={styles.muted}>
                            {category} · {garment} · {occasion} Wear · {colour}
                        </p>

                        <div style={styles.cards}>
                            {recommendations.map((design, index) => (
                                <article key={design} style={styles.card}>
                                    <DesignPhoto
                                        category={category}
                                        garment={garment}
                                        colour={colour}
                                        index={index}
                                    />

                                    <div style={styles.number}>
                                        DESIGN 0{index + 1}
                                    </div>

                                    <h3>{design}</h3>

                                    <p style={styles.muted}>
                                        {category} · {colour}
                                    </p>



                                    <div
                                        style={{
                                            ...styles.swatch,
                                            background: palette[colour],
                                            border:
                                                colour === "White"
                                                    ? "1px solid #BBBBBB"
                                                    : "none",
                                        }}
                                    />
                                </article>
                            ))}
                        </div>

                        <p style={styles.note}>
                            Recommendations are rule-based design suggestions.
                            Confirm the final design, fabric and measurements
                            with the customer.
                        </p>
                    </section>
                )}
            </div>
        </main>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#F7F3EA",
        padding: "24px 16px 50px",
        fontFamily: "Arial, sans-serif",
        color: "#173D38",
    },
    container: { maxWidth: "960px", margin: "0 auto" },
    back: {
        background: "transparent",
        border: "1px solid #B7CFC5",
        borderRadius: "8px",
        padding: "10px 14px",
        color: "#173D38",
        cursor: "pointer",
        marginBottom: "18px",
    },
    hero: {
        background: "#174A43",
        color: "#FFFFFF",
        borderRadius: "20px",
        padding: "30px 24px",
        textAlign: "center",
    },
    tag: {
        color: "#C5DED3",
        fontSize: "12px",
        letterSpacing: "2px",
        fontWeight: "bold",
    },
    title: { fontSize: "clamp(28px, 5vw, 42px)", margin: "14px 0 10px" },
    decor: { fontSize: "27px", marginTop: "22px" },
    panel: {
        background: "#FFFFFF",
        border: "1px solid #E4E8DF",
        borderRadius: "18px",
        padding: "24px",
        marginTop: "22px",
    },
    muted: { color: "#64756F", lineHeight: 1.6 },
    label: { display: "block", fontWeight: "bold", margin: "18px 0 8px" },
    select: {
        width: "100%",
        padding: "13px",
        borderRadius: "9px",
        border: "1px solid #C9D6CF",
        background: "#FFFEFA",
        color: "#173D38",
        fontSize: "15px",
    },
    generate: {
        width: "100%",
        padding: "15px",
        marginTop: "24px",
        border: "none",
        borderRadius: "10px",
        background: "#176E62",
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: "15px",
        cursor: "pointer",
    },
    results: { marginTop: "28px" },
    tagResult: {
        fontSize: "12px",
        color: "#176E62",
        letterSpacing: "2px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px",
        marginTop: "18px",
    },
    card: {
        background: "#FFFFFF",
        border: "1px solid #DDE6DE",
        borderRadius: "15px",
        padding: "14px",
        overflow: "hidden",
    },
    photo: {
        width: "100%",
        height: "260px",
        objectFit: "contain",
        borderRadius: "10px",
        background: "#F7F3EA",
        display: "block",
    },
    noPhoto: {
        width: "100%",
        height: "260px",
        boxSizing: "border-box",
        borderRadius: "10px",
        background: "#F1F3EA",
        color: "#64756F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "12px",
    },
    number: {
        color: "#819A8F",
        fontSize: "12px",
        fontWeight: "bold",
        marginTop: "12px",
    },
    tip: { color: "#64756F", fontSize: "14px", lineHeight: 1.6 },
    swatch: { width: "24px", height: "24px", borderRadius: "50%" },
    note: {
        color: "#64756F",
        fontSize: "13px",
        lineHeight: 1.6,
        marginTop: "18px",
    },
};
