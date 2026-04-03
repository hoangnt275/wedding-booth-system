const fs = require("fs").promises;
const path = require("path");
module.exports.index = async (req, res) => {
    const uploadDir = path.join(__dirname, "../../public/uploads"); // chỉnh theo vị trí file controller của bạn
    const imgTaked = await fs.readdir(uploadDir);
    const count = imgTaked.length;
    console.log("anh da chup:", imgTaked);
    res.render("admin/pages/imgTaked", {
        pageTitle: "Ảnh đã chụp",
        imgTaked,
        count,
    });
};
