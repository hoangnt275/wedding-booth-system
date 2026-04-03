// [GET] /
module.exports.index = (req, res) => {
    res.render("client/pages/guide", {
        pageTitle: "Trang huong dan",
    });
};
