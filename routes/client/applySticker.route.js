const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/applySticker.controller");
router.post("/", controller.postApplySticker);
router.get("/", controller.applySticker);
module.exports = router;
