// [GET] /admin/dashboard
const fs = require("fs");
module.exports.dashboard = async (req, res) => {
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tong quan",
    });
};
