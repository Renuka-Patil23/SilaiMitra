import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";


function Login() {
    const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setMessage(data.message || "Login failed");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
    } catch (error) {
        console.error("Login Error:", error);
        setMessage("Unable to connect to server");
    } finally {
        setLoading(false);
    }
};

    return (
    <div className="atelier">

      {/* LEFT VISUAL SIDE */}
        <section className="atelier-visual">

        <div className="top-bar">
            <div className="logo">
            <span>✂</span>
            SILAI MITRA
            </div>

            <div className="atelier-tag">
            DIGITAL ATELIER • 2026
        </div>
        </div>

        <div className="hero-content">
        <p className="eyebrow">CRAFTED FOR MODERN TAILORS</p>

        <h1>
            Your craft.
            <br />
            <i>Your signature.</i>
        </h1>

        <p className="hero-text">
            Where every measurement becomes a masterpiece
            and every stitch tells your story.
        </p>

        <div className="stitch">
            ─ ─ ─ ─ ─ ─ ─ ─
        </div>
        </div>

        <div className="fabric-box">
        <span>SELECTED FABRICS</span>

        <div className="swatches">
            <div className="swatch black"></div>
            <div className="swatch beige"></div>
            <div className="swatch blue"></div>
            <div className="swatch brown"></div>
        </div>
        </div>

        <div className="vertical-text">
            MEASURE • DESIGN • STITCH • DELIVER
        </div>

    </section>

      {/* RIGHT LOGIN SIDE */}
    <section className="login-section">

        <div className="login-card">

        <div className="mini-logo">
            ✦ SILAI MITRA
        </div>

        <p className="login-eyebrow">
            WELCOME BACK, MASTER
        </p>

        <h2>
            Step back into
            <br />
            <span>your atelier.</span>
        </h2>

        <p className="login-subtitle">
            Your customers, orders and craftsmanship
            are waiting for you.
        </p>

        <form onSubmit={handleLogin}>

            <div className="input-group">
            <label>ATELIER EMAIL</label>
            <input
                type="email"
                placeholder="master@silaimitra.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>

            <div className="input-group">
            <div className="password-label">
                <label>SECURE PATTERN</label>
                <span>Forgot stitch?</span>
            </div>

        <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>

            <div className="options">
            <label>
                <input type="checkbox" />
                Keep me signed in
            </label>

            <span>🔒 Secure access</span>
            </div>

            {message && (
                <p className="login-message">
                    {message}
                </p>
            )}

            <button
                className="enter-btn"
                type="submit"
                disabled={loading}
            >
                <span>
                    {loading ? "ENTERING..." : "ENTER THE ATELIER"}
                </span>
                <b>→</b>
            </button>

        </form>

        <div className="divider">
            <span>OR</span>
        </div>

        <button className="create-btn">
            Create your tailor profile
            <span>+</span>
        </button>

        <p className="bottom-note">
            Built for people who believe <i>details matter.</i>
        </p>

        </div>

        <div className="copyright">
            © SILAI MITRA — DIGITAL TAILOR STUDIO
        </div>

    </section>

    </div>
    );
}

export default Login;