const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/edit/editSummer.controller");
router.get("/", controller.editSummer);
router.post("/", controller.postEditSummer);
module.exports = router;
