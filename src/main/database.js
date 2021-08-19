const { Schema, model } = require("mongoose")

exports.threads = model("threads", Schema({
    user: {
        type: String,
        required: true
    },
    messages: {
        type: Array,
        default: []
    },
    participants: {
        type: Array,
        default: []
    },
    channel: {
        type: String,
        required: true
    }
}))