const config = require("config")

// Checks config variables
module.exports = function() {
    if (!config.get("dbUrl")) {
        throw new Error('ERROR: dbUrl is not defined')
    }
}