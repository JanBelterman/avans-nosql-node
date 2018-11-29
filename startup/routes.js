const express = require("express")

const users = require("../routes/users")
const friendships = require("../routes/friendships")
const threads = require("../routes/threads")
const comments = require("../routes/comments")

module.exports = function(app) {
    app.use(express.json())
    app.use('/api/users', users)
    app.use('/api/friendships', friendships)
    app.use('/api/threads', threads)
    app.use('/api/threads/:threadId/comments', function(req, res, next) {
        //This will pass the threadId through the route
        req.threadId = req.params.threadId
        next();
    }, comments)
}