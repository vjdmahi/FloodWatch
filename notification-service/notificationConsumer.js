const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "floodwatch-notification-service",
    brokers: ["kafka:9092"]
});

const consumer = kafka.consumer({
    groupId: "floodwatch-notification-service-group"
});

const startNotificationConsumer = async () => {

    try {

        await consumer.connect();

        console.log("🔔 Notification Service connected to Kafka");

        await consumer.subscribe({
            topic: "flood-alerts",
            fromBeginning: false
        });

        console.log("📡 Notification Service listening for flood alerts");

        await consumer.run({

            eachMessage: async ({ message }) => {

                const alert = JSON.parse(
                    message.value.toString()
                );

                console.log("");
                console.log("🚨 FLOOD NOTIFICATION");
                console.log(`📍 Location: ${alert.location}`);
                console.log(`💧 Water Level: ${alert.waterLevel} m`);
                console.log(`🚨 Severity: ${alert.severity}`);
                console.log(`⚠️ Message: ${alert.message}`);
                console.log("");
            }

        });

    } catch (error) {

        console.error("❌ Notification Service failed:");
        console.error(error.message);

    }
};

startNotificationConsumer();