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
        default: "avatar.png"
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
        type: [String],
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    products: {
        type: [String],
    },
    cart: {
        type: [String],
    },
    purchases: {
        type: [String],
    },
    numberPlate: {
        type: String,
    },
    isVerified: {
        type: Boolean,
    },
    postalAddress: {
        type: String,
    },
    houseAddress: {
        type: String,
    },
    region: {
        type: String,
    },
    carColor: {
        type: String,
    },
    driversLicense: {
        type: String,
    },
    carModel: {
        type: String,
    },
    ghanaCardNumber: {
        type: String,
    },
    geolocation: {
        type: String,
    }
});

module.exports = mongoose.model("User", userSchema);
