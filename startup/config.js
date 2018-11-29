const config = require("config")

// Checks config variables
module.exports = function() {
    if (!config.get("dbUrl")) {
        throw new Error('ERROR: dbUrl is not defined')
    }
    if (!config.get("neo4jBolt")) {
        throw new Error('ERROR: neo4jBolt is not defined')
    }
    if (!config.get("neo4jUsername")) {
        throw new Error('ERROR: neo4jUsername is not defined')
    }
    if (!config.get("neo4jPassword")) {
        throw new Error('ERROR: neo4jPassword is not defined')
    }
}