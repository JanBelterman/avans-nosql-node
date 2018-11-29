const commentsController = require('../controllers/comments')
const express = require('express')
const validateId = require('../middleware/validateId')

const router = express.Router()

router.post('/:id?', commentsController.create)
router.delete('/:id', validateId, commentsController)
router.post('/:id', commentsController.upvote)
router.post('/:id', commentsController.downvote)

module.exports = router