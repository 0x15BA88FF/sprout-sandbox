const mongoose = require("mongoose");

module.exports = mongoose.model("Chat", mongoose.Schema({
    roomName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
        default: "/images/avatar.png"
    },
    members: {
        type: [String],
        required: true,
    },
    messages: {
        type: [Object],
    },
}))