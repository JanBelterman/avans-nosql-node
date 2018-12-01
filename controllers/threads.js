const { Thread, validate, validateUpdate } = require("../models/thread")
const { User } = require("../models/user")
const { Comment } = require("../models/comment")

module.exports = {

    async create(req, res) {
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

    async update(req, res) {
        // Request body?
        const { error } = validateUpdate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Update thread
        const thread = await Thread.findById(req.params.id)
        if (!thread) return res.status(404).send("Cannot edit: thread not found")
        thread.content = req.body.content
        thread.save()
        // Response
        res.send(thread)
    },

    async delete(req, res) {
        const thread = await Thread.findById(req.params.id)
        if (!thread) return res.status(404).send("Thread doesn't exist")
        thread.remove()
            .then(() => {
                res.send(thread)
            })
    },

    async getAll(req, res) {
        // Get threads
        const threads = await Thread.find({}, { _id: 1, username: 1, title: 1, content: 1, upvotesCount: 1, downvotesCount: 1 })
        // Response
        res.send(threads)
    },

    async getOne(req, res) {
        // Get thread
        const thread = await Thread.findOne({ _id: req.params.id }, { upvotes: 0, downvotes: 0 })
        if (!thread) return res.status(404).send("No thread with this id")
        // Add comments
        let i = 0;
        for (let item of thread.comments) {
            thread.comments[i] = await loadComments(item)
            i++
        }
        // Response
        res.send(thread)
    }



}

// Load comments recursively
loadComments = function (parent) {
    return new Promise(async (resolve) => {
        parent = await Comment.findById(parent)
        if (parent.comments && parent.comments.length >= 1) {
            let i = 0
            for (let item of parent.comments) {
                parent.comments[i] = await loadComments(item)
                i++
            }
        }
        resolve(parent)
    })
}