const fs = require("fs/promises");
const path = require("path");
const { getLayoutByCode } = require("../../helper/layout-list");

const originalDir = path.join(__dirname, "../../public/uploads/original");
let currentCount = 0;

async function getLatestImageByIndex(dir) {
    const files = await fs.readdir(dir);

    let maxIndex = -1;
    let latestFile = null;

    for (const file of files) {
        const match = file.match(/^IMG_(\d+)\.(jpg|jpeg|png)$/i);
        if (!match) continue;

        const index = parseInt(match[1], 10);
        if (index > maxIndex) {
            maxIndex = index;
            latestFile = file;
        }
    }

    return latestFile;
}
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ================= GET /retake =================
module.exports.retake = async (req, res) => {
    try {
        const selectedLayout = req.session.selectedLayout || "layout-1";
        console.log("Selected layout:", selectedLayout);
        
        // SỬA LỖI 1: Thêm await ở đây
        const files = await fs.readdir(originalDir); 
        const imageFiles = files.filter((file) =>
            /\.(jpe?g|png)$/i.test(file),
        );
        currentCount = imageFiles.length;
        
        const layoutConfig = getLayoutByCode(selectedLayout);

        await delay(2000);
        const latestImage = await getLatestImageByIndex(originalDir);
        console.log("last image:", latestImage);
        
        res.render(`client/pages/retake`, {
            pageTitle: "Retake",
            latestImage: latestImage
                ? `/uploads/original/${latestImage}`
                : null,
            layoutConfig,
            currentCount
        });
    } catch (err) {
        console.error("❌ GET RETAKE ERROR:", err);
        res.status(500).send("Server error");
    }
};

// ================= POST /retake =================
module.exports.postRetake = async (req, res) => {
    try {
        // SỬA LỖI 2: Đổi imagesDir thành originalDir
        const latestImage = await getLatestImageByIndex(originalDir);

        if (latestImage) {
            await fs.unlink(path.join(originalDir, latestImage));
            console.log("🗑 Deleted:", latestImage);
        }

        res.json({ ok: true });
    } catch (err) {
        console.error("❌ POST RETAKE ERROR:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
};