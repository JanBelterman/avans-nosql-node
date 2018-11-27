const mongoose = require("mongoose")
const Joi = require("joi")

// User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// Request body validator
function validateUser(user) {
    const schema = {
        username: Joi.string().required(),
        password: Joi.string().required()
    }
    return Joi.validate(user, schema)
}

// Validate pw change
function validatePwChange(pwChange) {
    const schema = {
        username: Joi.string().required(),
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
    }
    return Joi.validate(pwChange, schema)
}

// Mongoose model
const User = mongoose.model('user', userSchema)

module.exports.User = User
module.exports.validate = validateUser
module.exports.validatePwChange = validatePwChange