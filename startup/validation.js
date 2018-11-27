const Joi = require("joi")

// Add mongo object id validation to Joi
module.exports = function() {
    Joi.objectId = require('joi-objectid')(Joi)
}