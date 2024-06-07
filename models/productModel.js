const mongoose = require("mongoose");

module.exports = mongoose.model("Product", mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    specification: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    metric: {
        type: String,
        required: true,
        default: 'pcs',
    },
    minQuantity: {
        type: Number,
        required: true,
        default: 0,
    },
    maxQuantity: {
        type: Number,
        required: true,
        default: 0,
    },
    images: {
        type: Array,
    },
    reviews: {
        type: Array,
    },
}));