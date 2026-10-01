const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "floodwatch-backend",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
});

const producer = kafka.producer();

const connectKafka = async () => {
    try {
        await producer.connect();

        console.log("✅ Kafka producer connected");

    } catch (error) {
        console.error("❌ Kafka connection failed:");
        console.error(error.message);
    }
};

const publishFloodAlert = async (alert) => {
    try {

        await producer.send({
            topic: "flood-alerts",

            messages: [
                {
                    key: alert.location,
                    value: JSON.stringify({
                        event: "FLOOD_ALERT_CREATED",
                        location: alert.location,
                        waterLevel: alert.waterLevel,
                        severity: alert.severity,
                        message: alert.message,
                        timestamp: alert.timestamp
                    })
                }
            ]
        });

        console.log("📨 Flood alert published to Kafka");

    } catch (error) {

        console.error("❌ Failed to publish flood alert:");
        console.error(error.message);

    }
};

module.exports = {
    connectKafka,
    publishFloodAlert
};