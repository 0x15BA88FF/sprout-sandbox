const mongoose = require("mongoose");

module.exports = mongoose.model("DeliverySession", mongoose.Schema({
    purchaseId: {
        type: String,
        required: true,
    },
    fromId: {
        type: String,
        required: true,
    },
    consumerId: {
        type: String,
        required: true,
    },
    driverId: {
        type: String
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