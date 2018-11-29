const { User, validate, validatePwChange } = require("../models/user")
const instance = require("../startup/neo4jdb")

module.exports = {

    async register(req, res, next) {
        // Request body correct?
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Username available?
        let user = await User.findOne({ username: req.body.username })
        if (user) return res.status(400).send('User already registered')
        // Save user to mongodb
        user = new User({
            username: req.body.username,
            password: req.body.password
        })
        await user.save()
        // Save to neo4j
        let session = instance.session()
        await session.run(
            'CREATE (p:Person {username: $username, password: $password}) RETURN p',
            { username: req.body.username, password: req.body.password }
        )
        session.close()
        // Response
        res.send(user)
    },

    async changePw(req, res, next) {
        // Request body correct?
        const { error } = validatePwChange(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Username exists?
        let user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(404).send("User not registered")
        // Old password correct?
        if (user.password !== req.body.oldPassword) return res.status(401).send("Old password is incorrect")
        // Update user to mongodb
        user.password = req.body.newPassword
        user.save()
        // Update user to neo4j
        let session = instance.session()
        await session.run(
            'MATCH (p {username: $username})' +
            'SET p.password = $password',
            { username: req.body.username, password: req.body.newPassword }
        )
        // Response
        res.send(user)
    },

    async deleteUser(req, res, next) {
        // Request body correct?
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Username exists?
        let user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(404).send("User not registered")
        // Password correct?
        if (user.password !== req.body.password) return res.status(401).send("Old password is incorrect")
        // Delete user from mongodb
        user.remove()
        // Delete user form neo4j
        let session = instance.session()
        await session.run(
            'MATCH (p {username: $username})' +
            'DELETE p',
            { username: req.body.username }
        )
        // Response
        res.send(user)
    }

}