const mongoose = require("mongoose")
const Joi = require("joi")

const Schema = mongoose.Schema

// Mongoose comment schema
const commentSchema = new mongoose.Schema({
    username: {
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

commentSchema.virtual('upvotesCount').get(function () {
    if (!this.upvotes) return 0
    return this.upvotes.length
})
commentSchema.virtual('downvotesCount').get(function () {
    if (!this.downvotes) return 0
    return this.downvotes.length
})

// Mongoose model
const Comment = mongoose.model('comment', commentSchema)

// Request body validator
function validateComment(comment) {
    const schema = {
        username: Joi.string().required(),
        content: Joi.string().required()
    }
    return Joi.validate(comment, schema)
}

module.exports.Comment = Comment
module.exports.validate = validateComment