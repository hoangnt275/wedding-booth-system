const path = require("path");
const fs = require("fs"); 
const QRCode = require("qrcode");

module.exports.index = async (req, res) => {
    try {
        // Lấy sessionCode đã được API Upload tạo ra và lưu lại trước đó
        const { finalPhoto, eventSlug, sessionCode } = req.session;

        // Xử lý dự phòng nếu mất session
        const currentEvent = eventSlug || "default-wedding";
        
        // Nếu không có sessionCode (do khách nhảy thẳng vào link /printing), tự sinh tạm 1 mã để không văng lỗi
        const currentCode = sessionCode || String(Date.now()).slice(-6); 

        // 1. Gắn vào URL và tạo mã QR
        // Link QR cho khách lẻ sẽ có dạng: fotolatter.info.vn/event/minh-hoa-wedding/142530
        const baseUrl = process.env.BASE_URL || "https://fotolatter.info.vn";
        const url = `${baseUrl}/event/${currentEvent}/${currentCode}`;

        const qr = await QRCode.toDataURL(url);

        // 2. Render giao diện
        res.render("client/pages/printing", {
            finalPhoto: `images/${finalPhoto}`,
            pageTitle: "Trang in ảnh",
            qr: qr,
            sessionCode: currentCode // Truyền mã ra frontend để in lên giấy nếu cần
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