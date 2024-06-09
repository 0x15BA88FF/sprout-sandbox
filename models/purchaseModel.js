const mongoose = require("mongoose");

module.exports = mongoose.model("Purchase", mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    isDevlivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        requred: true,
        default: Date.now()
    }
}));