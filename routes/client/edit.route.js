const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/edit.controller");
router.get("/", controller.edit);
router.post("/", controller.postEdit);
module.exports = router;
