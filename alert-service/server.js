const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Kafka } = require("kafkajs");

const Alert = require("./models/Alert");

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// Kafka Configuration
// ===============================

const kafka = new Kafka({
    clientId: "floodwatch-alert-service",
    brokers: ["kafka:9092"],
    connectionTimeout: 10000,
    requestTimeout: 30000
});

const producer = kafka.producer();

// ===============================
// Configuration
// ===============================

const PORT = 5004;

const MONGO_URI =
    process.env.MONGO_URI || "mongodb://mongodb:27017/floodwatch";

// ===============================
// MongoDB Connection
// ===============================

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("🍃 Alert Service connected to MongoDB");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);
    });

// ===============================
// Kafka Connection
// ===============================

const connectKafka = async () => {

    try {

        await producer.connect();

        console.log("📡 Alert Service connected to Kafka");

    } catch (error) {

        console.error("❌ Failed to connect Alert Service to Kafka:");
        console.error(error.message);

    }

};

connectKafka();

// ===============================
// Health Check
// ===============================

app.get("/health", (req, res) => {

    res.json({
        status: "OK",
        service: "FloodWatch Alert Service",
        timestamp: new Date()
    });

});

// ===============================
// Detect Flood Alert
// ===============================

app.post("/detect", async (req, res) => {

    try {

        const {
            location,
            waterLevel,
            rainfall,
            temperature,
            humidity
        } = req.body;

        // ===============================
        // Flood Detection Logic
        // ===============================

        let status;
        let severity;
        let message;

        if (waterLevel < 3.0) {

            status = "SAFE";
            severity = "LOW";
            message = "Water level is normal";

        } else if (waterLevel <= 4.0) {

            status = "WARNING";
            severity = "MEDIUM";
            message = "Water level is increasing";

        } else {

            status = "DANGER";
            severity = "HIGH";
            message = "Flood risk detected";

        }

        const alert = await Alert.create({
            location,
            waterLevel,
            rainfall,
            temperature,
            humidity,
            status,
            severity,
            message
        });

        // Publish alert to Kafka
        await producer.send({
            topic: "flood-alerts",
            messages: [
                {
                    value: JSON.stringify({
                        location,
                        waterLevel,
                        rainfall,
                        temperature,
                        humidity,
                        status,
                        severity,
                        message,
                        timestamp: alert.timestamp
                    })
                }
            ]
        });

        console.log(`🚨 Flood alert published for ${location}`);

        res.status(201).json({
            message: "Flood alert created and published successfully",
            alert
        });

    } catch (error) {

        console.error("❌ Failed to create flood alert:");
        console.error(error.message);

        res.status(500).json({
            message: "Failed to create flood alert",
            error: error.message
        });

    }

});

// ===============================
// Get Alerts
// ===============================

app.get("/alerts", async (req, res) => {

    try {

        const alerts = await Alert.find()
            .sort({ timestamp: -1 })
            .limit(50);

        res.json(alerts);

    } catch (error) {

        console.error("❌ Failed to fetch alerts:");
        console.error(error.message);

        res.status(500).json({
            message: "Failed to fetch alerts",
            error: error.message
        });

    }

});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {

    console.log(
        `🚨 Alert Service running on http://localhost:${PORT}`
    );

});