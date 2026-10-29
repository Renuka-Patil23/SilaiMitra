
import { useState } from "react";


const colorData = {
"Navy Blue": {
    hex: "#1E3A5F",
    matches: [
    { name: "White", hex: "#FFFFFF" },
    { name: "Beige", hex: "#D8C3A5" },
    { name: "Light Blue", hex: "#ADD8E6" },
    { name: "Grey", hex: "#808080" },
    ],
},
Black: {
    hex: "#222222",
    matches: [
    { name: "White", hex: "#FFFFFF" },
    { name: "Beige", hex: "#D8C3A5" },
    { name: "Red", hex: "#C62828" },
    { name: "Lavender", hex: "#C4B5FD" },
    ],
},
White: {
    hex: "#FFFFFF",
    matches: [
    { name: "Navy Blue", hex: "#1E3A5F" },
    { name: "Olive Green", hex: "#808000" },
    { name: "Brown", hex: "#8B5E3C" },
    { name: "Pastel Pink", hex: "#F4C2C2" },
    ],
},
Maroon: {
    hex: "#800000",
    matches: [
    { name: "Cream", hex: "#FFFDD0" },
    { name: "Black", hex: "#222222" },
    { name: "Beige", hex: "#D8C3A5" },
    { name: "Gold", hex: "#D4AF37" },
    ],
},
"Olive Green": {
    hex: "#808000",
    matches: [
    { name: "White", hex: "#FFFFFF" },
    { name: "Cream", hex: "#FFFDD0" },
    { name: "Black", hex: "#222222" },
    { name: "Tan", hex: "#D2B48C" },
    ],
},
Pink: {
    hex: "#EFA6C8",
    matches: [
    { name: "White", hex: "#FFFFFF" },
    { name: "Grey", hex: "#808080" },
    { name: "Navy Blue", hex: "#1E3A5F" },
    { name: "Cream", hex: "#FFFDD0" },
    ],
},
Green: {
    hex: "#228B22",
    matches: [
    { name: "White", hex: "#FFFFFF" },
    { name: "Cream", hex: "#FFFDD0" },
    { name: "Beige", hex: "#D8C3A5" },
    { name: "Black", hex: "#222222" },
    ],
},
Red: {
    hex: "#C62828",
    matches: [
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#222222" },
    { name: "Beige", hex: "#D8C3A5" },
    { name: "Navy Blue", hex: "#1E3A5F" },
    ],
},
};

function OutfitColorMatcher() {const [selectedColor, setSelectedColor] = useState("Navy Blue");

const selected = colorData[selectedColor];

return (
    <div className="outfit-matcher">
    <div className="matcher-header">
        <p className="matcher-eyebrow">SMART STITCH • STYLE ASSISTANT</p>
        <h1>Outfit Color Matcher</h1>
        <p>
        Choose your fabric colour and discover beautiful matching
        combinations for your next outfit.
        </p>
    </div>

    <section className="matcher-section">
        <h2>1. Select your base colour</h2>

        <div className="base-colors">
        {Object.entries(colorData).map(([name, data]) => (
            <button
            type="button"
            key={name}
            className={`base-color ${
                selectedColor === name ? "active" : ""
            }`}
            onClick={() => setSelectedColor(name)}
            aria-pressed={selectedColor === name}
            >
            <span
                className="color-swatch"
                style={{ backgroundColor: data.hex }}
            />
            <span>{name}</span>
            {selectedColor === name && (
                <span className="selected-label">Selected</span>
            )}
            </button>
        ))}
        </div>
    </section>

    <section className="matcher-section">
        <h2>2. Recommended combinations</h2>

        <div className="selected-preview">
        <span
            className="preview-swatch"
            style={{ backgroundColor: selected.hex }}
        />
        <div>
            <p>Your selected colour</p>
            <h3>{selectedColor}</h3>
        </div>
        </div>

        <div className="matching-colors">
        {selected.matches.map((color) => (
            <div className="matching-card" key={color.name}>
            <div
                className="matching-swatch"
                style={{ backgroundColor: color.hex }}
            />
            <div className="matching-info">
                <h3>{color.name}</h3>
                <p>{color.hex}</p>
            </div>
            <span className="match-check">✓</span>
            </div>
        ))}
        </div>

        <p className="matcher-tip">
        Style tip: Use your selected colour as the main fabric and try
        one of the suggested colours for a complementary outfit.
        </p>
    </section>
    </div>
);
}

export default OutfitColorMatcher;
