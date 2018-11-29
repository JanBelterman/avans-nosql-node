const mongoose = require("mongoose")
const Joi = require("joi")

// Mongoose thread schema
const threadSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

// Mongoose model
const Thread = mongoose.model('thread', threadSchema)

// Request body validator
function validateThread(thread) {
    const schema = {
        username: Joi.string().required(),
        title: Joi.string().required(),
        content: Joi.string().required()
    }
    return Joi.validate(thread, schema)
}

module.exports.Thread = Thread
module.exports.validate = validateThread