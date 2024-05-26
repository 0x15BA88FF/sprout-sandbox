const mongoose = require("mongoose");

module.exports = mongoose.model("User", mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
        default: "default.png"
    },
    accountType: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    phoneNumbers: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    product: {
        type: Array,
        required: false,
    },
    cart: {
        type: Array,
        required: false,
    },
    numberPlate: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        required: false,
    },
}))