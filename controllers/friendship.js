const { validateBefriend } = require("../models/friendship")
const { User } = require("../models/user")
const { neo4j } = require("../startup/db")

module.exports = {

    async befriendUsers(req, res, next) {
        // Request body correct?
        const { error } = validateBefriend(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Both usernames exist?
        let user = await User.findOne({ username: req.body.usernameOne })
        if (!user) return res.status(404).send("User one not registered")
        user = await User.findOne({ username: req.body.usernameTwo })
        if (!user) return res.status(404).send("User two not registered")
        // Create relation in neo4j
        let session = neo4j.session()
        await session.run(
            'MATCH (p1 {username: $usernameOne}), (p2 {username: $usernameTwo})' +
            'CREATE (p1)-[:friendsWith]->(p2)',
            { usernameOne: req.body.usernameOne, usernameTwo: req.body.usernameTwo }
        )
        // Response
        res.send("Friendship created")
    }

}