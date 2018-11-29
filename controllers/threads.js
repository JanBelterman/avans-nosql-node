const { Thread, validate } = require("../models/thread")
// neo4j?

module.exports = {

    createThread(req, res, next) {
        // Validate request body
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        // Save to MongoDb
        thread = new Thread({
            poster: req.body.poster,
            title: req.body.title,
            content: req.body.content
        })

        // Send response
        thread.save()
            .then(() => {
                res.send(thread)
            })

        
    }    
}