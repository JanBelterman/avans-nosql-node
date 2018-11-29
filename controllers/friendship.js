const { validateBefriend } = require("../models/friendship")
const { User } = require("../models/user")
const instance = require("../startup/neo4jdb")

module.exports = {

    async befriendUsers(req, res) {
        // Request body correct?
        const { error } = validateBefriend(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Both usernames exist?
        let user = await User.findOne({ username: req.body.usernameOne })
        if (!user) return res.status(404).send("User one not registered")
        user = await User.findOne({ username: req.body.usernameTwo })
        if (!user) return res.status(404).send("User two not registered")
        // Create relation in neo4j
        let session = instance.session()
        await session.run(
            'MATCH (p1 {username: $usernameOne}), (p2 {username: $usernameTwo})' +
            'MERGE (p1)-[:friendsWith]->(p2)',
            { usernameOne: req.body.usernameOne, usernameTwo: req.body.usernameTwo }
        )
        // Response
        res.send("Friendship created")
    },

    async defriendUsers(req, res, next) {
        // Request body correct?
        const { error } = validateBefriend(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Both usernames exist?
        let user = await User.findOne({ username: req.body.usernameOne })
        if (!user) return res.status(404).send("User one not registered")
        user = await User.findOne({ username: req.body.usernameTwo })
        if (!user) return res.status(404).send("User two not registered")
        // Delete relation in neo4j
        let session = instance.session()
        await session.run(
            'MATCH (p1:Person{username: $usernameOne})-[r:friendsWith]-(p2:Person{username: $usernameTwo})' +
            'DELETE r',
            { usernameOne: req.body.usernameOne, usernameTwo: req.body.usernameTwo }
        )
        // Response
        res.send("Friendship deleted")
    }

}