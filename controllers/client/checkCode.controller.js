const Session = require("../../models/session.model");

// [POST] /checkCode
module.exports.checkCode = async (req, res) => {
    try {
        // Lấy code từ body và loại bỏ khoảng trắng thừa
        // Dùng ?.trim() để tránh lỗi nếu req.body.code là undefined
        const code = req.body.code?.trim();

        // Ép khách phải nhập mã mới cho đi tiếp
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập mã code 6 số!",
            });
        }

        // Nhờ Service kiểm tra mã trong Database
        const enteredCode = await Session.findOne({
            code: code,
            status: "UNUSED",
        }); // Chỉ tìm mã có trạng thái AVAILABLE mới hợp lệ

        // NẾU MÃ KHÔNG TỒN TẠI (sai mã)
        if (!enteredCode) {
            return res.status(400).json({
                success: false,
                message: "Mã code không tồn tại, vui lòng kiểm tra lại!",
            });
        }
        if (enteredCode.paperSize === "SMALL") {
            req.session.paperSize = "SMALL";
            req.session.printMode = "DSRX1_STRIP_CUT";
        } else {
            req.session.paperSize = "LARGE";
            req.session.printMode = "DSRX1_4x6_NOCUT";
        }
        // Cập nhật trạng thái và thời gian bắt đầu
        enteredCode.status = "IN_PROGRESS";
        enteredCode.startedAt = new Date(); // Lưu thời điểm hiện tại vào Database

        // LƯU vào Database
        await enteredCode.save();
        // Lưu mã vào session để các bước sau còn dùng đến
        req.session.code = enteredCode.code;
        req.session.paperSize = enteredCode.paperSize; // Cờ để xác nhận mã đã được xác thực
        // Nếu hợp lệ, trả về cho màn hình Booth
        return res.status(200).json({
            success: true,
            message: "Mã hợp lệ, mời bạn chọn khung ảnh!",
            data: req.session, // Đã sửa thành req.session
        });
    } catch (error) {
        // Nếu có lỗi hệ thống (như lỗi kết nối DB), báo về cho màn hình Booth
        console.error("Lỗi tại /checkCode:", error);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra từ phía máy chủ, vui lòng thử lại sau!",
        });
    }
};
