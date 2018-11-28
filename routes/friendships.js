const friendshipController = require("../controllers/friendship")
const express = require("express")

const router = express.Router()

router.post("/", friendshipController.befriendUsers)

module.exports = router