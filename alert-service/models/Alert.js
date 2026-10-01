const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },

    waterLevel: {
        type: Number,
        required: true
    },

    rainfall: {
        type: Number,
        required: true
    },

    temperature: {
        type: Number,
        required: true
    },

    humidity: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        required: true
    },

    severity: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Alert", alertSchema);