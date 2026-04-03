const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/checkCode.controller");
router.post("/", controller.checkCode);
module.exports = router;
