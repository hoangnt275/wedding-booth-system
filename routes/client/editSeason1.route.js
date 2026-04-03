const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/edit/editSeason1.controller");
router.get("/", controller.editSeason1);
router.post("/", controller.postEditSeason1);
module.exports = router;
