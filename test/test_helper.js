const mongoose = require('mongoose')
const config = require("config")
const instance = require("../startup/neo4jdb")

before((done) => {
    // Connect mongoose to mongodb
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

beforeEach((done) => {
    // Drop all database content
    const { users } = mongoose.connection.collections
    users.drop()
        .then(() => done())
        .catch(() => done())
})

after((done) => {
    let session = instance.session()
    session.run('MATCH (n) DETACH DELETE n')
        .then(() => {
            done()
        })
})