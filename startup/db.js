const mongoose = require("mongoose")
const config = require("config")

module.exports.mongoose = function() {
    const dbUrl = config.get('dbUrl')
    mongoose.connect(dbUrl, { useNewUrlParser: true })
        .then(() => console.log(`Connected to ${dbUrl}..`))
}

const neo4j = require("neo4j-driver").v1

let driver

driver = neo4j.driver(config.get("neo4jSocket"), neo4j.auth.basic(config.get("neo4jUsername"), config.get("neo4jPassword")))

module.exports.neo4j = driver