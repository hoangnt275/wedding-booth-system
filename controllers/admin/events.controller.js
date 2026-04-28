const Event = require("../../models/event.model");

module.exports.index = async (req, res) => {
    try {
        // Fetch all events from DB that are not deleted, sorted by creation date
        const eventsData = await Event.find({ deleted: false }).sort({ createdAt: "desc" });

        res.render("admin/pages/events/index", {
            pageTitle: "Quản Lý Sự Kiện",
            events: eventsData
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách sự kiện:", error);
        req.flash('error', 'Lỗi lấy danh sách sự kiện');
        res.redirect('/admin/dashboard');
    }
};

module.exports.create = async (req, res) => {
    res.render("admin/pages/events/create", {
        pageTitle: "Tạo Sự Kiện"
    });
};

module.exports.createPost = async (req, res) => {
    try {
        // Ensure default values are captured
        const newEvent = new Event(req.body);
        await newEvent.save();

        req.flash('success', 'Tạo sự kiện photobooth thành công!');
        res.redirect("/admin/events");
    } catch (error) {
        console.error("Lỗi khi thêm mới sự kiện:", error);
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại');
        res.redirect("/admin/events/create");
    }
};

module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await Event.findOne({ _id: id, deleted: false });
        if(!event) {
            req.flash('error', 'Không tìm thấy sự kiện');
            return res.redirect('/admin/events');
        }
        res.render("admin/pages/events/detail", {
            pageTitle: "Chi Tiết Sự Kiện",
            event: event
        });
    } catch (error) {
        req.flash('error', 'Lỗi truy xuất dữ liệu');
        res.redirect('/admin/events');
    }
};

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await Event.findOne({ _id: id, deleted: false });
        if(!event) {
            req.flash('error', 'Không tìm thấy sự kiện');
            return res.redirect('/admin/events');
        }
        res.render("admin/pages/events/edit", {
            pageTitle: "Chỉnh Sửa Sự Kiện",
            event: event
        });
    } catch (error) {
        req.flash('error', 'Lỗi truy xuất dữ liệu');
        res.redirect('/admin/events');
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Cập nhật record
        await Event.updateOne({ _id: id, deleted: false }, req.body);
        
        req.flash('success', 'Cập nhật thông tin thành công!');
        res.redirect(`/admin/events/detail/${id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật');
        res.redirect(`/admin/events/edit/${id}`);
    }
};

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Event.updateOne({ _id: id }, { deleted: true });
        
        req.flash('success', 'Đã xóa sự kiện thành công!');
        res.redirect("/admin/events");
    } catch (error) {
        req.flash('error', 'Đã có lỗi xảy ra');
        res.redirect("/admin/events");
    }
};

module.exports.complete = async (req, res) => {
    try {
        const id = req.params.id;
        await Event.updateOne({ _id: id }, { status: "completed" });
        
        req.flash('success', 'Đã đánh dấu hoàn thành sự kiện!');
        res.redirect(req.get('Referrer') || "/admin/events");
    } catch (error) {
        req.flash('error', 'Đã có lỗi xảy ra');
        res.redirect(req.get('Referrer') || "/admin/events");
    }
};
