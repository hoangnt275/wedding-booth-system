const path = require("path");
const fs = require("fs");
module.exports.chooseFrame = (req, res) => {
    const frameType = req.query.frameType;
    req.session.frameType = frameType;
    const framePath = path.join(
        __dirname,
        "../../public/frames",
        `${frameType}_frame`,
    );

    if (!fs.existsSync(framePath)) {
        return res.status(404).send("Frame folder not found");
    }

    const frameList = fs
        .readdirSync(framePath)
        .filter((f) => /\.(png|jpe?g)$/i.test(f))
        .map((file) => ({
            name: path.basename(file, path.extname(file)), // basic-red
            url: `/frames/${frameType}_frame/${file}`,
        }));
    res.render("client/pages/chooseFrame", {
        pageTitle: "Chọn khung ảnh",
        frameType,
        frameList,
    });
};
module.exports.postChooseFrame = (req, res) => {
    const { frame } = req.body;
    req.session.selectedFrame = frame;
    const frameType = req.session.frameType;
    if (!frame) {
        return res.status(400).json({ success: false });
    }
    // Lưu frame đã chọn vào session
    if (frameType==="season1"|| frameType ==="small"||frameType==="diy") {
        req.session.printMode = "DSRX1_STRIP_CUT";
    } else {
        req.session.printMode = "DSRX1_4x6_NOCUT";
    }
    console.log("🖼️ Frame đã chọn:", req.session.selectedFrame);
    console.log("Loại Frame đã chọn:", req.session.frameType);

    res.json({ success: true, frameType: req.session.frameType });
};
