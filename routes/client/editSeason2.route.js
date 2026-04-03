const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/edit/editSeason2.controller");
router.get("/", controller.editSeason2);
router.post("/", controller.postEditSeason2);
module.exports = router;
