const path = require("path");
const fs = require("fs"); // Nhớ gọi thư viện fs để đọc file
const QRCode = require("qrcode");

module.exports.index = async (req, res) => {
    try {
        const { finalPhoto } = req.session;

        // 1. Lấy ngày và tháng hiện tại
        const now = new Date();
        const date = now.getDate();
        const month = now.getMonth() + 1; // Tháng trong Javascript bắt đầu từ 0 nên phải +1

        // 2. Đọc tổng số lượt chụp từ stats.json
        let totalSessions = 0;
        const statsFilePath = path.join(
            __dirname,
            "../../public/data/stats.json",
        );

        if (fs.existsSync(statsFilePath)) {
            const rawData = fs.readFileSync(statsFilePath, "utf8");
            if (rawData.trim() !== "") {
                const stats = JSON.parse(rawData);
                totalSessions = stats.totalSessions || 0;
            }
        }

        // 3. Tạo mã code theo định dạng: ngày-tháng-{totalSessions + 1}
        // Ví dụ: 28-3-112
        const code = `${date}-${month}-${totalSessions + 1}`;

        // 4. Gắn vào URL và tạo mã QR (Dự phòng localhost nếu BASE_URL chưa có)
        const baseUrl = process.env.BASE_URL;
        const url = `${baseUrl}/${code}`;

        const qr = await QRCode.toDataURL(url);

        // 5. Render giao diện
        res.render("client/pages/printing", {
            finalPhoto: `images/${finalPhoto}`,
            pageTitle: "Trang in ảnh",
            qr: qr,
        });
    } catch (error) {
        console.error("Lỗi tại trang in ảnh:", error);
        res.status(500).send("Đã có lỗi xảy ra khi tạo QR Code!");
    }
};
module.exports.test = (req, res) => {
    res.render("client/pages/testPrinting", {
        pageTitle: "Trang test in anh",
    });
};
