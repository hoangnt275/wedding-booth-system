const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/addFrames.controller");
const multer = require("multer");

// Multer lưu file tạm vào thư mục uploads_tmp/
const upload = multer({
    dest: "uploads_tmp/",
});

// GET trang quản lý khung
router.get("/", controller.index);

// Xoá nhiều
router.post("/delete-multiple", controller.deleteMultiple);

// Upload 1 khung
router.post("/upload", upload.single("frameFile"), controller.uploadFrames);

module.exports = router;
