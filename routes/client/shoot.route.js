const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/shoot.controller");
router.get("/", controller.shoot);
module.exports = router;
