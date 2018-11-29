const commentsController = require('../controllers/comments')
const express = require('express')
const validateId = require('../middleware/validateId')

const router = express.Router()

<<<<<<< HEAD
router.post('/:commentId?', commentsController.create)
// router.delete('/:cid', validateId, commentsController.delete)
// router.post('/:cid', commentsController.upvote)
// router.post('/:cid', commentsController.downvote)
=======
router.post('/:cid?', commentsController.create)
// router.delete('/:id', validateId, commentsController.delete)
// router.post('/:id', commentsController.upvote)
// router.post('/:id', commentsController.downvote)
>>>>>>> c4e95f21f8d037818f08148704c217a39db545b9

module.exports = router