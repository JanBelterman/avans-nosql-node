const Joi = require("joi")

// Validates mongodb object id from parameters
module.exports = function(req, res, next) {
    const schema = {
        id: Joi.objectId().required()
    }
    const { error } = Joi.validate({ id: req.params.id }, schema)
    if (error) return res.status(400).send("Invalid id")
    next()
}