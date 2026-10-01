const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Kafka } = require("kafkajs");

const Alert = require("./models/Alert");

const app = express();

// ===============================
// Kafka Configuration
// ===============================

const kafka = new Kafka({
    clientId: "floodwatch-alert-service",
    brokers: ["kafka:9092"]
});

const producer = kafka.producer();

const PORT = 5004;
const MONGO_URI =
    process.env.MONGO_URI || "mongodb://mongodb:27017/floodwatch";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("🍃 Alert Service connected to MongoDB");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);
    });

app.use(cors());
app.use(express.json());

// Alert Service Health Check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        service: "FloodWatch Alert Service",
        timestamp: new Date()
    });
});

app.get("/alerts", async (req, res) => {
    try {
        const alerts = await Alert.find()
            .sort({ timestamp: -1 })
            .limit(50);

        res.json({
            status: "SUCCESS",
            count: alerts.length,
            alerts
        });

    } catch (error) {
        console.error("❌ Failed to fetch alerts:");
        console.error(error.message);

        res.status(500).json({
            status: "ERROR",
            message: "Failed to fetch alerts"
        });
    }
});

// Test Alert Endpoint
app.post("/test-alert", (req, res) => {
    console.log("🚨 Test alert received:");
    console.log(req.body);

    res.json({
        status: "SUCCESS",
        service: "FloodWatch Alert Service",
        message: "Alert received successfully",
        alert: req.body
    });
});

// Flood Detection
app.post("/detect", async  (req, res) => {
    const {
        location,
        waterLevel,
        rainfall,
        temperature,
        humidity
    } = req.body;

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

    const alert = {
        location,
        waterLevel,
        rainfall,
        temperature,
        humidity,
        status,
        severity,
        message,
        timestamp: new Date()
    };

    const savedAlert = await Alert.create(alert);

    console.log("💾 Alert saved to MongoDB");
    console.log(savedAlert);

    console.log("🚨 Flood Alert Processed:");
    console.log(alert);

    // ===============================
    // Publish Alert to Kafka
    // ===============================

await producer.send({
    topic: "flood-alerts",
    messages: [
        {
            value: JSON.stringify(alert)
        }
    ]
});

console.log("📨 Flood alert published to Kafka");

    

    res.json({
        status: "SUCCESS",
        service: "FloodWatch Alert Service",
        alert
    });
});

const startServer = async () => {

    try {

        await producer.connect();

        console.log("📡 Alert Service connected to Kafka");

        app.listen(PORT, () => {

            console.log(
                `🚨 Alert Service running on http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.error("❌ Failed to connect Alert Service to Kafka:");
        console.error(error.message);

    }

};

startServer();