const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/codeList.controller");
router.get("/", controller.index);
router.get("/detail/:id", controller.getDetail);
router.post("/edit/:id", controller.postEdit);
router.get("/edit/:id", controller.getEdit);
module.exports = router;
