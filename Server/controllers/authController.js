const bcrypt = require("bcryptjs");

const {
    findUserByEmail,
    findUserById,
    createUser
} = require("../models/userModel");

const generateToken = require("../utils/generateToken");

// ==========================
// REGISTER
// ==========================
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Basic password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Check if user already exists
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Only allow valid roles
        const userRole = role === "admin" ? "admin" : "staff";

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userId = await createUser(
            name,
            email,
            hashedPassword,
            userRole
        );

        // Get created user
        const user = await findUserById(userId);

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
            token
        });

    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};


// ==========================
// LOGIN
// ==========================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = generateToken(user);

        // Don't send password back
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        };

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: safeUser,
            token
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


// ==========================
// GET CURRENT USER
// ==========================
const getMe = async (req, res) => {
    try {
        const user = await findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get Me Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    register,
    login,
    getMe
};