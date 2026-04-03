const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/edit/editDiy.controller");
router.get("/", controller.editDiy);
router.post("/", controller.postEditDiy);
module.exports = router;
