const mongoose = require('mongoose')
const config = require("config")
const instance = require("../startup/neo4jdb")

// Connect to mongodb
before((done) => {
    const dbUrl = config.get("dbUrl")
    mongoose.connect(dbUrl, { useNewUrlParser: true })
        .then(() => {
            console.log(`Connected to ${dbUrl}..`)
            done()
        })
        .catch(() => {
            throw new Error("Cant connect to mongodb")
        })
})

// Clear all databases before each test
// So each test can assume to have an emtpy dataset
beforeEach(async () => {
    const { users } = mongoose.connection.collections
    try {
        await users.drop()
    } catch (err) { }
    try {
        let session = instance.session()
        await session.run('MATCH (n) DETACH DELETE n')
    } catch(err) { }
})