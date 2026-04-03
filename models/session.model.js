const mongoose = require("mongoose");

// Bản vẽ khuôn đúc cho 1 Phiên chụp (Session / Mã code)
const sessionSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true, // Bắt buộc phải có, không có code thì không cho lưu
            unique: true, // Mỗi mã là duy nhất, trùng là báo lỗi
            trim: true, // Tự động cắt khoảng trắng thừa (ví dụ: " 123456 " thành "123456")
        },
        paperSize: {
            type: String,
            required: true,
            // enum (Liệt kê): Bắt buộc giá trị chỉ được nằm trong danh sách này.
            // Gõ sai chữ "SMALL" là nó chửi ngay.
            enum: ["SMALL", "LARGE"],
        },
        status: {
            type: String,
            enum: ["UNUSED", "IN_PROGRESS", "COMPLETED", "EXPIRED"],
            default: "UNUSED", // Nếu không nói gì, mặc định mã mới tạo là chưa dùng
        },
        layoutCode: {
            type: String,
            default: null, // Thu ngân không chọn, khách vào booth bấm chọn thì mới lưu vào đây (VD: "STRIP_4")
        },
        price: {
            type: Number,
            required: true,
            min: 0, // Giá tiền vé thu ngân thu của khách (VD: 50000)
        },
        paymentType: {
            type: String,
            required: true,
            enum: ["CASH", "BANKING"], // Thanh toán bằng tiền mặt hay chuyển khoản
        },
        note: {
            type: String,
            default: "", // Ghi chú của thu ngân (VD: "Khách VIP", "Mã bù lỗi kẹt giấy")
        },
        startedAt: {
            type: Date,
            default: null, // Lưu thời điểm khách bấm xác nhận mã trên màn hình booth
        },
        endedAt: {
            type: Date,
            default: null, // Lưu thời điểm in ảnh xong và upload cloud thành công
        },
        digitalPhotoUrl: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // Thần chú này tự động thêm 2 trường: createdAt (lúc tạo) và updatedAt (lúc sửa)
    },
);

// Tạo khuôn đúc có tên là "Session" và xuất ra để dùng
// Kiểm tra xem model Session đã tồn tại trong bộ nhớ chưa.
// Nếu có rồi thì lấy ra dùng luôn, nếu chưa thì mới tạo mới.
const Session =
    mongoose.models.Session || mongoose.model("Session", sessionSchema);

module.exports = Session;
