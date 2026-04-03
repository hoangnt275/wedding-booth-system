const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chooseFrame.controller");
router.get("/", controller.chooseFrame);
router.post("/", controller.postChooseFrame);
module.exports = router;
