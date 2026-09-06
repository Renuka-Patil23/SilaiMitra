import { useParams, useNavigate } from "react-router-dom";

import lehenga1 from "../assets/designs/lehenga/lehenga1.jpg";
import lehenga2 from "../assets/designs/lehenga/lehenga2.jpg";
import lehenga3 from "../assets/designs/lehenga/lehenga3.jpg";
import lehenga4 from "../assets/designs/lehenga/lehenga4.jpg";

import blouse1 from "../assets/designs/blouse/blouse1.jpg";
import blouse2 from "../assets/designs/blouse/blouse2.jpg";
import blouse3 from "../assets/designs/blouse/blouse3.jpg";
import blouse4 from "../assets/designs/blouse/blouse4.jpg";

import shirt1 from "../assets/designs/shirt/shirt1.jpg";
import shirt2 from "../assets/designs/shirt/shirt2.jpg";
import shirt3 from "../assets/designs/shirt/shirt3.jpg";
import shirt4 from "../assets/designs/shirt/shirt4.jpg";

import custom1 from "../assets/designs/custom/custom1.jpg";
import custom2 from "../assets/designs/custom/custom2.jpg";
import custom3 from "../assets/designs/custom/custom3.jpg";
import custom4 from "../assets/designs/custom/custom4.jpg";

function DesignGallery() {
    const { category } = useParams();
    const navigate = useNavigate();

    const designs = {
        lehenga: [lehenga1, lehenga2, lehenga3, lehenga4],
        shirt: [shirt1, shirt2, shirt3, shirt4],
        blouse: [blouse1, blouse2, blouse3, blouse4],
        custom: [custom1, custom2, custom3, custom4]
    };

    const selectedDesigns = designs[category] || [];

    return (
        <div className="design-page">

            <button
                className="design-back-btn"
                onClick={() => navigate("/dashboard")}
            >
                ← BACK TO DASHBOARD
            </button>

            <div className="design-page-heading">
                <p>STYLE BOARD</p>
                <h1>{category?.toUpperCase()} DESIGNS</h1>
                <span>Choose inspiration for your next stitch.</span>
            </div>

            <div className="design-page-grid">
                {selectedDesigns.map((image, index) => (
                    <div className="design-page-card" key={index}>
                        <img
                            src={image}
                            alt={`${category} design ${index + 1}`}
                        />

                        <p>DESIGN {String(index + 1).padStart(2, "0")}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default DesignGallery;