const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/applyFilter.controller");
router.post("/", controller.applyFilter);
router.get("/", controller.testApplyFilter);
module.exports = router;
