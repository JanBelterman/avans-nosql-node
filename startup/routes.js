const express = require("express")

const users = require("../routes/users")
const friendships = require("../routes/friendships")
const threads = require("../routes/threads")

module.exports = function(app) {
    app.use(express.json())
    app.use('/api/users', users)
    app.use('/api/friendships', friendships)
    app.use('/api/threads', threads)
    app.use('/api/thread/:id/comments', comments)
}