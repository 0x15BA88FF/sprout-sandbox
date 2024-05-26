const mongoose = require("mongoose");

module.exports = mongoose.model("Review", mongoose.Schema({
    fromID: {
        type: String,
        required: true,
    },
    toID: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}))