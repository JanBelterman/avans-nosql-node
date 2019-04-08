const mongoose = require("mongoose")
const Joi = require("joi")

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
    comments: [this],
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

// commentSchema.pre('remove', function(next) {
//     const Comment = mongoose.model('comment');
//     console.log("pre remove called")

//     Comment.deleteMany({ _id: { $in: this.comments } })
//         .then(() => {
//             console.log("delete many done")
//             next()
//         })
// })

// Mongoose model
// const Comment = mongoose.model('comment', commentSchema)

// Request body validator
// function validateComment(commentSchema) {
//     const schema = {
//         username: Joi.string().required(),
//         content: Joi.string().required()
//     }
//     return Joi.validate(commentSchema, schema)
// }

module.exports.NewComment = commentSchema
// module.exports.validate = validateComment