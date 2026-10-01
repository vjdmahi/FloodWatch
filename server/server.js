
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const SensorReading = require("./models/SensorReading");
const Alert = require("./models/Alert");


const {
    connectKafka,
    publishFloodAlert
} = require("./services/kafkaService");

const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// MongoDB Connection
// ===============================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);
    });

connectKafka();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// Root Route
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "FloodWatch Backend is running!"
    });
});

// ===============================
// Health Check
// ===============================

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        service: "FloodWatch Backend",
        timestamp: new Date()
    });
});

// ===============================
// Receive Sensor Data
// ===============================

app.post("/api/sensor-data", async (req, res) => {

    try {

        // Get sensor data from request
        const sensorData = req.body;

        console.log("📡 Sensor data received:");
        console.log(sensorData);

        // ===============================
        // Convert Water Level
        // ===============================

        const waterLevel = Number(sensorData.waterLevel);

        // ===============================
        // Flood Detection Variables
        // ===============================

        let status;
        let severity;
        let message;

        // ===============================
        // Flood Detection Logic
        // ===============================

        if (waterLevel < 3.0) {

            status = "SAFE";
            severity = "LOW";
            message = "Water level is normal";

        } 
        else if (waterLevel <= 4.0) {

            status = "WARNING";
            severity = "MEDIUM";
            message = "Water level is increasing";

        } 
        else {

            status = "DANGER";
            severity = "HIGH";
            message = "Flood risk detected";

        }

        // ===============================
        // Flood Detection Result
        // ===============================

        const floodResult = {

            location: sensorData.location,
            waterLevel: waterLevel,
            status: status,
            severity: severity,
            message: message,
            timestamp: sensorData.timestamp

        };

        console.log("🚨 Flood Detection Result:");
        console.log(floodResult);

        // ===============================
        // Create MongoDB Sensor Reading
        // ===============================

        const reading = new SensorReading({

            location: sensorData.location,

            waterLevel: waterLevel,

            rainfall: sensorData.rainfall,

            temperature: sensorData.temperature,

            humidity: sensorData.humidity,

            status: status,

            severity: severity,

            message: message,

            timestamp: sensorData.timestamp

        });

        // ===============================
        // Save Sensor Reading
        // ===============================

        await reading.save();

        console.log("💾 Sensor reading saved to MongoDB");

// Close active alert when location returns to SAFE
if (status === "SAFE") {

    await Alert.updateMany(
        {
            location: sensorData.location,
            active: true
        },
        {
            active: false
        }
    );

    console.log("✅ Active alert closed for this location");
}
        
// Create alert for WARNING or DANGER
if (status === "WARNING" || status === "DANGER") {

    // Check if this location already has an active alert
    const existingAlert = await Alert.findOne({
        location: sensorData.location,
        active: true
    });

    // Only create a new alert if there is no active alert
    if (!existingAlert) {

        const alert = new Alert({
            location: sensorData.location,
            waterLevel: waterLevel,
            severity: severity,
            message: message,
            active: true,
            timestamp: sensorData.timestamp
        });

        await alert.save();

        console.log("🚨 New alert saved to MongoDB");

        await publishFloodAlert(alert);

    } else {

        console.log("⚠️ Active alert already exists for this location");

    }
}

        // ===============================
        // Send Response
        // ===============================

        res.status(201).json({

            message: "Sensor data processed and saved successfully",

            result: floodResult

        });

    } 
    catch (error) {

        console.error("❌ Failed to process sensor data:");
        console.error(error.message);

        res.status(500).json({

            message: "Failed to process sensor data",

            error: error.message

        });

    }

});

// ===============================
// Get Latest Sensor Readings
// ===============================

app.get("/api/sensor-readings", async (req, res) => {

    try {

        const readings = await SensorReading
            .find()
            .sort({ timestamp: -1 })
            .limit(50);

        res.json({

            count: readings.length,

            readings: readings

        });

    } 
    catch (error) {

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

app.get("/api/latest-readings", async (req, res) => {

    try {

        const latestReadings = await SensorReading.aggregate([
            
            // Step 1: Sort newest readings first
            {
                $sort: {
                    timestamp: -1
                }
            },

            // Step 2: Group readings by location
            {
                $group: {
                    _id: "$location",

                    // Take the first reading
                    latestReading: {
                        $first: "$$ROOT"
                    }
                }
            },

            // Step 3: Return the actual reading
            {
                $replaceRoot: {
                    newRoot: "$latestReading"
                }
            },

            // Step 4: Sort locations alphabetically
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
// Get Alert History
// ===============================

app.get("/api/alerts", async (req, res) => {

    try {

        const alerts = await Alert
            .find({ active: true })
            .sort({ timestamp: -1 })
            .limit(50);

        res.json({
            count: alerts.length,
            alerts: alerts
        });

    } catch (error) {

        console.error("❌ Failed to get alerts:");
        console.error(error.message);

        res.status(500).json({
            message: "Failed to retrieve alerts",
            error: error.message
        });

    }

});

// ===============================
// Get Alert History
// ===============================

app.get("/api/alert-history", async (req, res) => {

    try {

        const alerts = await Alert
            .find()
            .sort({ timestamp: -1 })
            .limit(50);

        res.json({
            count: alerts.length,
            alerts: alerts
        });

    } catch (error) {

        console.error("❌ Failed to get alert history:");
        console.error(error.message);

        res.status(500).json({
            message: "Failed to retrieve alert history",
            error: error.message
        });

    }

});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {

    console.log(
        `FloodWatch Backend running on http://localhost:${PORT}`
    );

});