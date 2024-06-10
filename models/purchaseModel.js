const mongoose = require("mongoose");

module.exports = mongoose.model("Purchase", mongoose.Schema({
    consumerId: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    isDevlivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
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
