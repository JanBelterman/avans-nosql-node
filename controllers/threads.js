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
        // Request body?
        const { error } = validateUpdate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Update thread
        const thread = await Thread.findById(req.params.id)
        thread.content = req.body.content
        thread.save()
        // Response
        res.send(thread)
    },

    async delete(req, res, next) {
        const thread = await Thread.findByIdAndDelete(req.params.id)
        if (!thread) return res.status(404).send("Thread doesn't exist")
        res.send(thread)
    },

    async getAll(req, res, next) {
        // Get threads
        const threads = await Thread.find({}, { _id: 1, username: 1, title: 1, content: 1, upvotesCount: 1, downvotesCount: 1 })
        // Response
        res.send(threads)
    },

    async getOne(req, res, next) {
        // Get thread // TODO: get all comments recursively?
        const thread = await Thread.findOne({ _id: req.params.id }, { upvotes: 0, downvotes: 0 }).populate('comments', { path: 'comments' })
        // Thread exists?
        if (!thread) res.status(404).send("Thread doesn't exist")
        // Response
        res.send(thread)
    }

}