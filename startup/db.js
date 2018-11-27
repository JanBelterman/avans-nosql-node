const mongoose = require("mongoose")
const config = require("config")

module.exports = function() {
    const dbUrl = config.get('dbUrl')
    mongoose.connect(dbUrl, { useNewUrlParser: true })
        .then(() => console.log(`Connected to ${dbUrl}..`))
}