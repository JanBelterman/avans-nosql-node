const mongoose = require("mongoose")
const Joi = require("joi")
require('./comments')

const Schema = mongoose.Schema

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
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    upvotes: [String],
    downvotes: [String]
})

threadSchema.virtual('upvotesCount').get(function () {
    if (!this.upvotes) return 0
    return this.upvotes.length
})
threadSchema.virtual('downvotesCount').get(function () {
    if (!this.downvotes) return 0
    return this.downvotes.length
})

threadSchema.set("toObject", { virtuals: true })
threadSchema.set('toJSON', { virtuals: true })

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

// Request body validator
function validateUpdate(thread) {
    const schema = {
        content: Joi.string().required()
    }
    return Joi.validate(thread, schema)
}

module.exports.Thread = Thread
module.exports.validate = validateThread
module.exports.validateUpdate = validateUpdate