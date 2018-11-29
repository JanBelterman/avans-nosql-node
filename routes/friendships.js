const friendshipController = require("../controllers/friendship")
const express = require("express")

const router = express.Router()

router.post("/", friendshipController.befriendUsers)
router.delete("/", friendshipController.defriendUsers)

module.exports = router