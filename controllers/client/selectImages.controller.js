// Thay đổi import sang fs/promises để dùng được async/await chuẩn
const fs = require("fs/promises");
const path = require("path");
// Nhớ import file config layout của bạn
const { getLayoutByCode } = require("../../helper/layout-list");

module.exports.index = async (req, res) => {
    try {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "raw");
        let files = [];

        // Lấy thông tin Layout khách đã chọn để biết họ được chọn mấy tấm
        const selectedLayout = req.session.selectedLayout;
        const layoutConfig = getLayoutByCode(selectedLayout);

        try {
            // Đọc thư mục bằng hàm bất đồng bộ chuẩn (bỏ chữ Sync)
            const allFiles = await fs.readdir(uploadDir);

            // Lọc ra các file ảnh
            const imageFiles = allFiles.filter((file) =>
                /\.(jpg|jpeg|png)$/i.test(file),
            );

            // Dùng Promise.all để lấy thông tin stat song song
            const fileStatsPromises = imageFiles.map(async (file) => {
                // Đã dùng fs/promises nên await fs.stat sẽ hoạt động hoàn hảo
                const stat = await fs.stat(path.join(uploadDir, file));
                return { file, mtime: stat.mtime.getTime() };
            });

            const filesWithStats = await Promise.all(fileStatsPromises);

            // Sắp xếp theo thời gian tăng dần (cũ nhất đến mới nhất)
            files = filesWithStats
                .sort((a, b) => a.mtime - b.mtime)
                .map((item) => item.file);
        } catch (dirErr) {
            console.log("Thư mục ảnh chưa tồn tại hoặc rỗng:", dirErr.message);
        }

        // Lấy đúng 12 ảnh mới nhất để hiển thị
        const photos = files.slice(-12);

        res.render("client/pages/select-images", {
            photos: photos,
            layoutConfig: layoutConfig, // Truyền config xuống để View biết photoCount
        });
    } catch (error) {
        console.error("Lỗi hệ thống khi tải ảnh:", error);
        res.render("client/pages/select-images", {
            photos: [],
            layoutConfig: null,
        });
    }
};
