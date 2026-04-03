// [GET] /admin/addFrames
const path = require("path");
const fs = require("fs");
module.exports.index = async (req, res) => {
    const filter = req.query.filter || "small";
    const framesFolder = path.join(
        __dirname,
        `../../public/frames/${filter}_frame`
    ); // thư mục chứa ảnh
    // Lấy danh sách các file trong folder
    const frames = fs
        .readdirSync(framesFolder)
        .map((file) => `/frames/${filter}_frame/${file}`)
        .filter((file) => /\.(png|jpg|jpeg)$/i.test(file));
    console.log(frames);
    res.render("admin/pages/addFrames", {
        pageTitle: "Thêm khung ảnh",
        framesPath: frames,
        filter: filter,
    });
};
module.exports.deleteMultiple = async (req, res) => {
    try {
        const paths = req.body.paths; // array

        paths.forEach((p) => {
            const filePath = path.join(__dirname, `../../public`, p);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
};
module.exports.uploadFrames = async (req, res) => {
    try {
        const filter = req.body.filter; // small | bigVerti | bigHori
        const file = req.file;

        console.log("Filter:", filter);
        console.log("Uploaded file:", file);

        if (!file) {
            return res.json({ success: false, error: "Không có file upload" });
        }

        // Thư mục đích
        const targetDir = path.join(
            __dirname,
            `../../public/frames/${filter}_frame`
        );

        // Nếu folder chưa tồn tại → tạo
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Tên file đích
        const ext = path.extname(file.originalname);
        const newFileName = Date.now() + ext;

        const targetPath = path.join(targetDir, newFileName);

        // Di chuyển file từ folder tmp → folder frames
        fs.renameSync(file.path, targetPath);

        res.redirect(`/admin/addFrames?filter=${filter}`);
    } catch (err) {
        console.error(err);
        res.json({ success: false, error: err.message });
    }
};
