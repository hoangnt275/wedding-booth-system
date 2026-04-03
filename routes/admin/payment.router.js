const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/payment.controller");
router.get("/", controller.payment);
router.get("/code", controller.code);
router.post("/code", controller.codePost);
router.post("/create", controller.createPost);
module.exports = router;
