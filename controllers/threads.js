const { Thread, validate, validateUpdate } = require("../models/thread")
const { User } = require("../models/user")

module.exports = {

    async create(req, res, next) {
        // Request body correct?
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Username exists?
        let user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(404).send("User not registered")
        // Save thread to mongodb
        thread = new Thread({
            username: req.body.username,
            title: req.body.title,
            content: req.body.content
        })
        await thread.save()
        // Response
        res.send(thread)
    },

    async update(req, res, next) {
        // Request body & id correct?
        req.body.threadId = req.params.id
        const { error } = validateUpdate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Update thread
        const thread = await Thread.findById(req.params.id)
        thread.content = req.body.content
        thread.save()
        // Response
        res.send(thread)
    }

}