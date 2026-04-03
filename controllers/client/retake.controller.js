const fs = require("fs/promises");
const path = require("path");
const { getLayoutByCode } = require("../../helper/layout-list");

const imagesDir = path.join(__dirname, "../../public/uploads/original");

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

// ================= GET /retakeSmall =================
module.exports.retake = async (req, res) => {
    try {
        const selectedLayout = req.session.selectedLayout || "layout-1";
        console.log(selectedLayout);
        const layoutConfig = getLayoutByCode(selectedLayout);

        await delay(2000);
        const latestImage = await getLatestImageByIndex(imagesDir);
        console.log("last image:", latestImage);
        res.render(`client/pages/retake`, {
            pageTitle: "Retake",
            latestImage: latestImage
                ? `/uploads/original/${latestImage}`
                : null,
            layoutConfig,
        });
    } catch (err) {
        console.error("❌ GET RETAKE ERROR:", err);
        res.status(500).send("Server error");
    }
};

// ================= POST /retakeSmall =================
module.exports.postRetake = async (req, res) => {
    try {
        const latestImage = await getLatestImageByIndex(imagesDir);

        if (latestImage) {
            await fs.unlink(path.join(imagesDir, latestImage));
            console.log("🗑 Deleted:", latestImage);
        }

        res.json({ ok: true });
    } catch (err) {
        console.error("❌ POST RETAKE ERROR:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
};
