const mongoose = require('mongoose')
const config = require("config")

const neo4j = require("neo4j-driver").v1
let driver = neo4j.driver(config.get("neo4jSocket"), neo4j.auth.basic(config.get("neo4jUsername"), config.get("neo4jPassword")))

before((done) => {
    const dbUrl = config.get("dbUrl")
    mongoose.connect(dbUrl, { useNewUrlParser: true })
        .then(() => {
            console.log(`Connected to ${dbUrl}..`)
            done()
        })
})

beforeEach((done) => {
    const { users, threads } = mongoose.connection.collections

    Promise.all([users.drop(), threads.drop()]).then(() => {
        let session = driver.session()
            session.run(
                'MATCH (p:Person)' +
                'DELETE p'
            ).then(() => {
                done()
            }).catch(() => {
                done()
            })
    })
    .catch(() => {
        let session = driver.session()
            session.run(
                'MATCH (p:Person)' +
                'DELETE p'
            ).then(() => {
                done()
            }).catch(() => {
                done()
            })
    })

    // users.drop()
    //     .then(() => {
    //         let session = driver.session()
    //         session.run(
    //             'MATCH (p:Person)' +
    //             'DELETE p'
    //         ).then(() => {
    //             done()
    //         }).catch(() => {
    //             done()
    //         })
    //     })
    //     .catch(() => {
    //         let session = driver.session()
    //         session.run(
    //             'MATCH (p:Person)' +
    //             'DELETE p'
    //         ).then(() => {
    //             done()
    //         }).catch(() => {
    //             done()
    //         })
    // })
})

module.exports.instance = driver