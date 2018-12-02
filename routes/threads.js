const threadsController = require("../controllers/threads")
const express = require("express")
const validateId = require("../middleware/validateId")

const router = express.Router({mergeParams: true})

router.post("/", threadsController.create)
router.put("/:id", validateId, threadsController.update)
router.delete("/:id", validateId, threadsController.delete)
router.get("/", threadsController.getAll)
router.get("/:id", validateId, threadsController.getOne)
router.post("/:id/upvotes", validateId, threadsController.upvote)
router.post("/:id/downvotes", validateId, threadsController.downvote)
router.get("/byusername/:username", threadsController.getFeed)

module.exports = router