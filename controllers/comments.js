const { Comment, validate } = require('../models/comment')
const { User } = require("../models/user")

module.exports = {

    create(req, res) {
        // Validate body
        const { error } = validate(req.body)
        if(error) return res.status(400).send(error.details[0].message)

        // Check if user exists
        let user = User.findOne({ username: req.body.username })
        if(!user) return res.status(404).send("User not registered")
        
        // Create new Comment
        comment = new Comment({
            username: req.body.username,
            content: req.body.content
        })

        // Save and respond
        comment.save()
            .then(() => {
                res.send(comment)
            })
    }
}