const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/edit/editBigVerti.controller");
router.get("/", controller.editBigVerti);
router.post("/", controller.postEditBigVerti);
module.exports = router;
