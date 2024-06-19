const mongoose = require("mongoose");

module.exports = mongoose.model("Purchase", mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    deliverySession: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        default: 0.00,
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
    },
}));
