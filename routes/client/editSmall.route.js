const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/edit/editSmall.controller");
router.get("/", controller.editSmall);
router.post("/", controller.postEditSmall);
module.exports = router;
