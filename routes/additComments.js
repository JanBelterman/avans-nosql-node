const commentsController = require('../controllers/comments')
const express = require('express')
const validateId = require('../middleware/validateId')

const router = express.Router()

router.post('/:id/upvotes', validateId, commentsController.upvote)
router.post('/:id/downvotes', validateId, commentsController.downvote)

module.exports = router