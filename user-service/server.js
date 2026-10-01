const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5005;

const MONGO_URI =
    process.env.MONGO_URI || "mongodb://mongodb:27017/floodwatch";

const JWT_SECRET =
    process.env.JWT_SECRET || "floodwatch-development-secret";

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("🍃 User Service connected to MongoDB");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);
    });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        service: "FloodWatch User Service",
        timestamp: new Date()
    });
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status: "ERROR",
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                status: "ERROR",
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            status: "SUCCESS",
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("❌ Registration failed:");
        console.error(error.message);

        res.status(500).json({
            status: "ERROR",
            message: "Registration failed"
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: "ERROR",
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                status: "ERROR",
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            status: "SUCCESS",
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("❌ Login failed:");
        console.error(error.message);

        res.status(500).json({
            status: "ERROR",
            message: "Login failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `🔐 User Service running on http://localhost:${PORT}`
    );
});