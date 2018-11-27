const mongoose = require('mongoose')
const config = require("config")

before(done => {
    const dbUrl = config.get("dbUrl")
    mongoose.connect(dbUrl, { useNewUrlParser: true })
        .then(() => {
            console.log(`Connected to ${dbUrl}..`)
            done()
        })
})

beforeEach((done) => {
    const { users } = mongoose.connection.collections
    users.drop()
        .then(() => done())
        .catch(() => done())
})