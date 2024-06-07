const mongoose = require("mongoose");

module.exports = mongoose.model("Review", mongoose.Schema({
    fromId: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}))