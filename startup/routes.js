const express = require("express")

const users = require("../routes/users")
const friendships = require("../routes/friendships")

module.exports = function(app) {
    app.use(express.json())
    app.use('/api/users', users)
    app.use('/api/friendships', friendships)
}