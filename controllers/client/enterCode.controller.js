// [GET] /
module.exports.index = (req, res) => {
    res.render("client/pages/enterCode", {
        pageTitle: "Trang nhap ma",
    });
};
