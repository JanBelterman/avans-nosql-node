// Create app
const express = require('express');
const app = express();

// Configuration
require("./startup/config")()
require("./startup/routes")(app)
require("./startup/validation")()
// Test helper creates its own db, bacause express, mongoose and mocha don't integrate well
if (process.env.NODE_ENV !== 'test') {
    require("./startup/db").mongoose()
}

// Export for testing
module.exports = app;