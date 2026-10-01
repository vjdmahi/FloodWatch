const sendFloodNotification = (alert) => {

    console.log("🔔 FLOOD NOTIFICATION");

    console.log(`📍 Location: ${alert.location}`);
    console.log(`💧 Water Level: ${alert.waterLevel} m`);
    console.log(`🚨 Severity: ${alert.severity}`);
    console.log(`⚠️ Message: ${alert.message}`);

};

module.exports = {
    sendFloodNotification
};