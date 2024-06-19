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
        default: "other",
        required: true
    },
    currency: {
        type: String,
        default: "ghs",
        required: true
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
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    images: {
        type: Array,
        required: true
    },
    reviews: {
        type: Array,
    },
    rating: {
        type: Number,
    },
    dataCreated: {
        type: Date,
        required: true,
        default: Date.now()
    }
}));
