const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/selectFrame.controller");
router.get("/", controller.index);
router.post("/", controller.saveInfo);
module.exports = router;
