module.exports.index = async (req, res) => {
    res.render("admin/pages/settings/index", {
        pageTitle: "Cài Đặt"
    });
};
