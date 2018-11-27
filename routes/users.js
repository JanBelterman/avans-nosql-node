const usersController = require("../controllers/users")
const express = require("express")

const router = express.Router()

router.post("/", usersController.register)
router.put("/", usersController.changePw)
router.delete("/", usersController.deleteUser)

module.exports = router