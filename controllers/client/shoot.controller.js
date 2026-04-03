// [GET] /
const fs = require("fs");
const path = require("path");
// Nhớ import hàm từ file layout-list.js vào nhé
const { getLayoutByCode } = require("../../helper/layout-list");

module.exports.shoot = (req, res) => {
    const originalDir = path.join(__dirname, "../../public/uploads/original");
    let currentCount = 0;

    // 1. Lấy mã layout khách đã chọn từ session
    const selectedLayout = req.session.selectedLayout || "layout-1";
    console.log(selectedLayout);

    // 2. Lấy toàn bộ thông số layout từ "Database mini"
    const layoutConfig = getLayoutByCode(selectedLayout);

    try {
        if (fs.existsSync(originalDir)) {
            const files = fs.readdirSync(originalDir);
            const imageFiles = files.filter((file) =>
                /\.(jpe?g|png)$/i.test(file),
            );
            currentCount = imageFiles.length;
        }
    } catch (err) {
        console.error("Lỗi đếm file:", err);
    }

    // 3. Truyền config xuống View
    res.render(`client/pages/shoot`, {
        pageTitle: "Trang chup anh",
        currentCount: currentCount,
        layoutConfig: layoutConfig,
    });
};
