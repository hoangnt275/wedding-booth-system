const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/selectPrinting.controller");
router.get("/", controller.index);
module.exports = router;
