const mongoose = require("mongoose")
const config = require("config")

module.exports.mongoose = function() {
    const dbUrl = config.get('dbUrl')
    mongoose.connect(dbUrl, { useNewUrlParser: true })
        .then(() => console.log(`Connected to ${dbUrl}..`))
        .catch(() => consolelog(`Failed to connect to ${dbUrl}..`))
}