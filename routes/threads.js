const threadsController = require("../controllers/threads")
const express = require('express')

const router = express.Router()

//router.post("/", threadsController.createThread)
router.post("/", threadsController.createThread)
router.get("")
//get
//put
//delete

module.exports = router