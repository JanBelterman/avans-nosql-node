const { Comment, validate } = require('../models/comment')
const { User } = require('../models/user')
const { Thread } = require('../models/thread')

module.exports = {

    create(req, res) {
        // Validate body
        const { error } = validate(req.body)
        if(error) return res.status(400).send(error.details[0].message)

        // Check if optional comment exists
        let parentComment
        if(req.params.cid) {
            parentComment = Comment.findOne({ _id: req.params.cid})
            if(!parentComment) return res.status(404).send('Parent comment not found')
        }

        // Check if user exists
        let user = User.findOne({ username: req.body.username })
        if(!user) return res.status(404).send('User not registered')
        
        // Create new Comment
        comment = new Comment({
            username: req.body.username,
            content: req.body.content
        })

        // Save on parent comment or thread
        if(parentComment) {
            //Save in parent comment and respond
            parentComment.comments.push(comment._id)
            
            comment.save()
                .then(() => {
                    parentComment.save()
                        .then(() => {
                            return res.send(comment)
                        })
                })
            
        } else {
            //Save in parent thread and respond
            let thread
            console.log(req.threadId)
            Thread.findOne({ _id: req.threadId})
                .then((result) => {
                    thread = result
                })

            console.log(thread);
            
            
            thread.comments.push(comment._id)

            thread.save()
                .then(() => {
                    comment.save()
                        .then(() => {
                            return res.send(comment)
                        })
                })
        }        
    },

    delete(req, res) {
        //
    }
}