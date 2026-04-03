const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/retake.controller");
router.get("/", controller.retake);
router.post("/", controller.postRetake);
module.exports = router;
