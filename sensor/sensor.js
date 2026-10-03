const axios = require("axios");

const locations = [
    "Hatton",
    "Kandy",
    "Nuwara Eliya",
    "Gampola",
    "Kurunegala"
];

function generateSensorData() {
    return {
        location: locations[Math.floor(Math.random() * locations.length)],
        waterLevel: Number((Math.random() * 6).toFixed(2)),
        rainfall: Number((Math.random() * 150).toFixed(2)),
        temperature: Number((20 + Math.random() * 15).toFixed(1)),
        humidity: Number((60 + Math.random() * 40).toFixed(1)),
        timestamp: new Date()
    };
}

async function sendSensorData() {
    const data = generateSensorData();

    try {
        const response = await axios.post(
            "http://sensor-service:5001/sensor-data",
            data
        );

        console.log("📡 Data sent to FloodWatch:");
        console.log(response.data);

    } catch (error) {
        console.error("❌ Failed to send sensor data:");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

setInterval(sendSensorData, 5000);

sendSensorData();