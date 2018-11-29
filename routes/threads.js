const threadsController = require("../controllers/threads")
const express = require("express")

const router = express.Router()

router.post("/", threadsController.create)
router.put("/:id", threadsController.update)

module.exports = router