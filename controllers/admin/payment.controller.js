// [GET] /admin/payment
module.exports.payment = (req, res) => {
    res.render("admin/pages/payment/index", {
        pageTitle: "Trang thanh toan",
    });
};
// [GET] /admin/payment/code
module.exports.code = (req, res) => {
    res.render("admin/pages/payment/code", {
        pageTitle: "Trang tao ma",
    });
};
// [POST] /admin/payment/code
module.exports.codePost = (req, res) => {
    console.log(req.body);
    res.render("admin/pages/payment/code", {
        pageTitle: "Trang tao ma",
        paperSize: req.body.paperSize,
        paymentType: req.body.paymentType,
        note: req.body.note,
    });
};
// [POST] /admin/payment/create
const Session = require("../../models/session.model");
module.exports.createPost = async (req, res) => {
    let price;
    const paperSize = req.body.paperSize;
    if (paperSize === "SMALL") {
        price = 70000;
    } else if (paperSize === "LARGE") {
        price = 100000;
    }
    try {
        const session = await Session.create({
            code: req.body.code,
            paperSize: req.body.paperSize,
            paymentType: req.body.paymentType,
            note: req.body.note,
            price: price,
        });

        res.status(200).json({ message: "Tạo thành công", session: session });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi lưu payment" });
    }
};
