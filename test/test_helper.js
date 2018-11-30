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
            console.log(`Can't connect to ${dbUrl}..`)
            process.exit(1)
        })
})

// Clear all databases before each test
// So each test can assume to have an emtpy dataset
beforeEach((done) => {
    const { users } = mongoose.connection.collections
    users.drop()
        .then(() => {
            let session = instance.session()
            return session.run('MATCH (n) DETACH DELETE n')
        })
        .catch(() => { })
        .then(() => done())
})