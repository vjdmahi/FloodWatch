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

    severity: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    active: {
    type: Boolean,
    default: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Alert", alertSchema);