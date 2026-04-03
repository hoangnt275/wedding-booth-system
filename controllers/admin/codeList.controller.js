// controllers/admin/session.controller.js
const Session = require("../../models/Session.model");

module.exports.index = async (req, res) => {
    try {
        // 1. Khởi tạo bộ lọc (Find Object)
        let find = {};

        // =========================================
        // FIX: ĐẶT MẶC ĐỊNH LÀ NGÀY HÔM NAY
        // =========================================
        if (!req.query.date) {
            const now = new Date();
            now.setHours(now.getHours() + 7); // Cộng 7 tiếng để ra đúng múi giờ Việt Nam
            req.query.date = now.toISOString().split("T")[0]; // Cắt lấy chuỗi YYYY-MM-DD
        }

        // Lọc theo trạng thái
        if (req.query.status) {
            find.status = req.query.status;
        }

        // Lọc theo thanh toán (CASH / BANKING)
        if (req.query.paymentType) {
            find.paymentType = req.query.paymentType;
        }

        // Lọc theo giá (Ví dụ: truyền chính xác giá vào)
        if (req.query.price) {
            find.price = parseInt(req.query.price);
        }

        // =========================================
        // FIX: XỬ LÝ LỖI MÚI GIỜ (LỆCH 1H SÁNG)
        // =========================================
        if (req.query.date) {
            // Nối thêm chuỗi 'T00:00:00+07:00' để ép Node.js hiểu đây là
            // 0h00 phút sáng tính theo đúng giờ Việt Nam (UTC+7).
            const searchDate = new Date(`${req.query.date}T00:00:00+07:00`);

            const nextDate = new Date(searchDate);
            nextDate.setDate(searchDate.getDate() + 1);

            find.createdAt = {
                $gte: searchDate,
                $lt: nextDate,
            };
        }

        // 2. Lấy dữ liệu từ DB (Sắp xếp mới nhất lên đầu)
        const records = await Session.find(find).sort({ createdAt: -1 });

        // 3. Tính toán Thống kê ngay trên mảng records vừa tìm được
        const totalCount = records.length;
        const totalRevenue = records.reduce((sum, item) => sum + item.price, 0);

        // 4. Lấy danh sách các mức giá đang có trong DB để đổ ra dropdown (Không bị fix cứng)
        const uniquePrices = await Session.distinct("price");

        res.render("admin/pages/codeList", {
            pageTitle: "Danh sách mã đã tạo",
            records: records,
            totalCount: totalCount,
            totalRevenue: totalRevenue,
            uniquePrices: uniquePrices.sort((a, b) => a - b), // Sắp xếp giá tăng dần
            query: req.query, // Trả lại query để giữ trạng thái thẻ select đang chọn
        });
    } catch (error) {
        console.error("Lỗi:", error);
        res.redirect("back");
    }
};
// 1. GIAO DIỆN CHI TIẾT (Nút ℹ️)
// ==========================================
module.exports.getDetail = async (req, res) => {
    try {
        const id = req.params.id;

        // Tìm bản ghi theo ID trong database
        const session = await Session.findById(id);

        if (!session) {
            return res.redirect("back"); // Không tìm thấy thì quay lại
        }

        // Render ra file Pug chi tiết và truyền data xuống
        res.render("admin/pages/sessions/detail", {
            pageTitle: `Chi tiết mã - ${session.code}`,
            session: session,
        });
    } catch (error) {
        console.error("Lỗi trang Chi tiết:", error);
        res.redirect("back");
    }
};

// ==========================================
// 2. GIAO DIỆN CHỈNH SỬA (Nút ✏️)
// ==========================================
module.exports.getEdit = async (req, res) => {
    try {
        const id = req.params.id;
        const session = await Session.findById(id);

        if (!session) {
            return res.redirect("back");
        }

        // Render ra file Pug chứa Form sửa
        res.render("admin/pages/sessions/edit", {
            pageTitle: `Chỉnh sửa mã - ${session.code}`,
            session: session,
        });
    } catch (error) {
        console.error("Lỗi trang Chỉnh sửa:", error);
        res.redirect("back");
    }
};

// ==========================================
// 3. XỬ LÝ LƯU DỮ LIỆU SỬA (Submit Form)
// ==========================================
module.exports.postEdit = async (req, res) => {
    try {
        const id = req.params.id;

        // BẢO MẬT: Chỉ lấy đúng 4 trường được phép sửa từ req.body
        // Nếu ai đó cố tình gửi thêm biến "status" hay "code" từ F12, hệ thống sẽ tự động bỏ qua
        const { paperSize, price, paymentType, note } = req.body;

        const updateData = {
            paperSize: paperSize,
            price: price,
            paymentType: paymentType,
            note: note,
        };

        // Cập nhật vào Database
        await Session.updateOne({ _id: id }, updateData);

        // Trở về trang danh sách
        res.redirect("/admin/codeList");
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu sửa:", error);
        res.redirect("back");
    }
};
