const { Comment, validate } = require('../models/comment')
const { User } = require('../models/user')
const { Thread } = require('../models/thread')

module.exports = {

    create(req, res) {
        // Validate body
        const { error } = validate(req.body)
        if(error) return res.status(400).send(error.details[0].message)

        // Check if optional comment exists
        // let parentPromise
        // if(req.params.commentId) {
        //     parentPromise = Comment.findOne({ _id: req.params.commentId})
        // } else {
        //     console.log("No commentId provided.");            
        // }

        // Check if user exists
        let user
        User.findOne({ username: req.body.username })
            .then((result) => {
                user = result
                if(!user) return res.status(404).send('User not registered')
            })
        
        // Create new Comment
        comment = new Comment({
            username: req.body.username,
            content: req.body.content
        })

        // Save on parent comment or thread
        if(req.params.commentId) {
            Comment.findOne({ _id: req.params.commentId}).then((parentComment) => {
                //Save in parent comment and respond
                if(!parentComment) return res.status(404).send("Parent comment not found")
                console.log("Parent comment found... Saving in comment")
                parentComment.comments.push(comment._id)
                
                comment.save()
                    .then(() => {
                        parentComment.save()
                            .then(() => {
                                return res.send(comment)
                            })
                    })
            })
        } else {
            console.log("No parent commentId provided... Saving in thread")
            Thread.findOne({ _id: req.threadId})
                .then((result) => {
                    if(!result) return res.status(404).send("Thread not found")
                    const thread = result

                    thread.comments.push(comment._id)

                    thread.save()
                        .then(() => {
                            comment.save()
                                .then(() => {
                                    return res.send(comment)
                                })
                        })
                })
        }
    },

    delete(req, res) {
        Comment.findById(req.params.commentId).then((result) => {
            result.delete().then(() => {
                return res.send(result)
            })
            .catch(() => {
                return res.status(404).send("Comment not found")
            })
        })
    },

    async upvote(req, res) {
        // Get comment
        const comment = await Comment.findOne({ _id: req.params.id })
        if (!comment) return res.status(404).send("No comment with this id")
        // User exists?
        const user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(404).send("No user found")
        // User already upvoted?
        if (comment.upvotes.indexOf(req.body.username) !== -1) return res.status(400).send("Already upvoted")
        // Update comment
        comment.upvotes.push(req.body.username) // add upvote
        const index = comment.downvotes.indexOf(req.body.username)
        if (index !== -1) comment.downvotes.splice(index, 1) // remove optional downvote
        await comment.save()
        // Response
        res.send(`Upvoted for user: ` + req.body.username)
    },

    async downvote(req, res) {
        // Get comment
        const comment = await Comment.findOne({ _id: req.params.id })
        if (!comment) return res.status(404).send("No comment with this id")
        // User exists?
        const user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(404).send("No user found")
        // User already dowvoted?
        if (comment.downvotes.indexOf(req.body.username) !== -1) return res.status(400).send("Already downvoted")
        // Update comment
        comment.downvotes.push(req.body.username) // add downvote
        const index = comment.upvotes.indexOf(req.body.username)
        if (index !== -1) comment.upvotes.splice(index, 1) // remove optional upvote
        await comment.save()
        // Response
        res.send(`Downvoted for user: ` + req.body.username)
    }

}