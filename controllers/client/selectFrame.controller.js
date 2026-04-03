const path = require("path");
const fs = require("fs");
const { getLayoutByCode } = require("../../helper/layout-list");

module.exports.index = async (req, res) => {
    try {
        const { selectedLayout } = req.query; // Lấy từ URL
        console.log(selectedLayout);
        // Tạo đường dẫn tuyệt đối đến thư mục chứa frame (tránh lỗi sai path)
        const dirPath = path.join(
            __dirname,
            "../../public/frames",
            selectedLayout,
        );

        // Đọc thư mục (Đổi tên biến thành frameList cho khớp)
        const frameList = await fs.readdirSync(dirPath);
        console.log(frameList);
        // Render file pug và ném thẳng dữ liệu vào
        res.render("client/pages/select-frame", {
            frameList: frameList,
            selectedLayout,
        });
    } catch (error) {
        console.log("Lỗi đọc thư mục frame:", error.message);
        // Nếu thư mục không tồn tại hoặc lỗi, vẫn render nhưng mảng rỗng
        res.render("client/pages/select-frame", {
            frameList: [],
        });
    }
};
module.exports.saveInfo = (req, res) => {
    const { selectedFrame, selectedLayout } = req.body;
    const layoutConfig = getLayoutByCode(selectedLayout);

    req.session.selectedFrame = selectedFrame;
    req.session.selectedLayout = selectedLayout;
    req.session.paperSize = layoutConfig.paperSize;
    res.json({ success: true });
};
