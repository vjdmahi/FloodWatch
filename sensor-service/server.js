require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const SensorReading = require("./models/SensorReading");

const app = express();

const PORT = 5001;

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Sensor Service connected to MongoDB");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);
    });

// ===============================
// Root Route
// ===============================

app.get("/", (req, res) => {

    res.json({
        message: "FloodWatch Sensor Service is running!"
    });

});

// ===============================
// Health Check
// ===============================

app.get("/health", (req, res) => {

    res.json({
        status: "OK",
        service: "FloodWatch Sensor Service",
        timestamp: new Date()
    });

});

// ===============================
// Test Sensor Endpoint
// ===============================

app.post("/sensor-data", async (req, res) => {

    try {

        const sensorData = req.body;

        console.log("📡 Sensor Service received data:");
        console.log(sensorData);

        // ===============================
        // Convert Water Level
        // ===============================

        const waterLevel = Number(sensorData.waterLevel);

        // ===============================
        // Send Data to Alert Service
        // ===============================

        const alertResponse = await fetch("http://alert-service:5004/detect", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                location: sensorData.location,

                waterLevel: waterLevel,

                rainfall: sensorData.rainfall,

                temperature: sensorData.temperature,

                humidity: sensorData.humidity

            })

        });

        if (!alertResponse.ok) {

            throw new Error(
                `Alert Service returned status ${alertResponse.status}`
            );

        }

        const alertResult = await alertResponse.json();

        console.log("🚨 Alert Service response:");
        console.log(alertResult.alert);

        // ===============================
        // Create Sensor Reading
        // ===============================

        const reading = new SensorReading({

            location: sensorData.location,

            waterLevel: waterLevel,

            rainfall: sensorData.rainfall,

            temperature: sensorData.temperature,

            humidity: sensorData.humidity,

            status: alertResult.alert.status,

            severity: alertResult.alert.severity,

            message: alertResult.alert.message,

            timestamp: sensorData.timestamp,

        });

        // ===============================
        // Save to MongoDB
        // ===============================

        await reading.save();

        console.log("💾 Sensor reading saved to MongoDB");

        // ===============================
        // Response
        // ===============================

        res.status(201).json({

            message: "Sensor data processed and saved successfully",

            result: {

                location: sensorData.location,

                waterLevel: waterLevel,

                status: alertResult.alert.status,

                severity: alertResult.alert.severity,

                message: alertResult.alert.message,

                timestamp: sensorData.timestamp

            }

        });

    } catch (error) {

        console.error("❌ Failed to process sensor data:");
        console.error(error.message);

        res.status(500).json({

            message: "Failed to process sensor data",

            error: error.message

        });

    }

});

// ===============================
// Get Sensor Reading History
// ===============================

app.get("/sensor-readings", async (req, res) => {

    try {

        const readings = await SensorReading
            .find()
            .sort({ timestamp: -1 })
            .limit(50);

        res.json({

            count: readings.length,

            readings: readings

        });

    } catch (error) {

        console.error("❌ Failed to get sensor readings:");
        console.error(error.message);

        res.status(500).json({

            message: "Failed to retrieve sensor readings",

            error: error.message

        });

    }

});

// ===============================
// Get Latest Reading Per Location
// ===============================

app.get("/latest-readings", async (req, res) => {

    try {

        const latestReadings = await SensorReading.aggregate([

            {
                $sort: {
                    timestamp: -1
                }
            },

            {
                $group: {
                    _id: "$location",

                    latestReading: {
                        $first: "$$ROOT"
                    }
                }
            },

            {
                $replaceRoot: {
                    newRoot: "$latestReading"
                }
            },

            {
                $sort: {
                    location: 1
                }
            }

        ]);

        res.json({

            count: latestReadings.length,

            readings: latestReadings

        });

    } catch (error) {

        console.error("❌ Failed to get latest readings:");
        console.error(error.message);

        res.status(500).json({

            message: "Failed to retrieve latest readings",

            error: error.message

        });

    }

});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {

    console.log(
        `📡 Sensor Service running on http://localhost:${PORT}`
    );

});