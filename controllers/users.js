const { User, validate, validatePwChange } = require("../models/user")

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
        // Response
        res.send(user)
    },

    async deleteUser(req, res, next) {
        // Request body correct>
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Username exists?
        let user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(404).send("User not registered")
        // Password correct?
        if (user.password !== req.body.password) return res.status(401).send("Old password is incorrect")
        // Delete user from mongodb
        user.remove()
        // Response
        res.send(user)
    }

}