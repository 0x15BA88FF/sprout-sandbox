const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
        type: [String], // Array of strings for phone numbers
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
    products: {
        type: [String],
        required: false,
    },
    cart: {
        type: [String],
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
    houseAddress: {
        type: String,
        required: false,
    },
    region: {
        type: String,
        required: false,
    },
    carColor: {
        type: String,
        required: false,
    },
    driversLicense: {
        type: String,
        required: false,
    },
    carModel: {
        type: String,
        required: false,
    },
    ghanaCardNumber: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model("User", userSchema);
