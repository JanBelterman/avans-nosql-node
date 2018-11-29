const commentsController = require('../controllers/comments')
const express = require('express')
const validateId = require('../middleware/validateId')

const router = express.Router()

router.post('/:commentId?', commentsController.create)
// router.delete('/:cid', validateId, commentsController.delete)
// router.post('/:cid', commentsController.upvote)
// router.post('/:cid', commentsController.downvote)

module.exports = router