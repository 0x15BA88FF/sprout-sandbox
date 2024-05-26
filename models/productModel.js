const mongoose = require("mongoose");

module.exports = mongoose.model("Product", mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    specifications: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    metric: {
        type: String,
        required: true,
        default: 'pcs',
    },
    dateOfHarvest: {
        type: Date,
        required: true,
        default: Date.now(),
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
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    reviews: {
        type: Array,
        required: true,
    },
}));