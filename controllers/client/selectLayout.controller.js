const fs = require("fs");
const path = require("path");

module.exports.index = (req, res) => {
    const layoutFolderPath = path.join(process.cwd(), "public", "layout");
    let layouts = [];

    try {
        const files = fs.readdirSync(layoutFolderPath);

        // Lọc lấy ảnh png và tạo mảng object chứa tên file + mã layout
        layouts = files
            .filter((file) => file.toLowerCase().endsWith(".png"))
            .map((file) => {
                return {
                    fileName: file, // Vd: "layout-1.png"
                    layoutCode: file.replace(".png", ""), // Vd: "layout-1" (cắt bỏ đuôi png)
                };
            });
    } catch (error) {
        console.error(`Không thể đọc thư mục layout`, error);
    }

    res.render("client/pages/select-layout", {
        layouts: layouts, // Truyền mảng layouts xuống view
    });
};
