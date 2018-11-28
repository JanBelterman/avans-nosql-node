const Joi = require("joi")

// Validate befriend
function validateBefriend(befriend) {
    const schema = {
        usernameOne: Joi.string().required(),
        usernameTwo: Joi.string().required()
    }
    return Joi.validate(befriend, schema)
}

module.exports.validateBefriend = validateBefriend