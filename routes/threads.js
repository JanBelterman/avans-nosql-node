const threadsController = require("../controllers/threads")
const express = require("express")
const validateId = require("../middleware/validateId")

const router = express.Router()

router.post("/", threadsController.create)
router.put("/:id", validateId, threadsController.update)
router.delete("/:id", validateId, threadsController.delete)
router.get("/", threadsController.getAll)
router.get("/:id", validateId, threadsController.getOne)

module.exports = router