const mongoose = require("mongoose");

module.exports = mongoose.model("DeviverySession", mongoose.Schema({
    driverId: {
        type: String,
    },
    fromId: {
        type: String,
        required: true,
    },
    consumerId: {
        type: String,
        required: true,
    },
    purchaseId: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
}))