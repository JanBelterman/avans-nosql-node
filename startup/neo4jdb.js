const neo4j = require("neo4j-driver").v1
const config = require("config")

let driver

driver = neo4j.driver(config.get("neo4jBolt"), neo4j.auth.basic(config.get("neo4jUsername"), config.get("neo4jPassword")))

module.exports = driver