const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { mergeBigVerti } = require("../../../helper/merge-bigverti.js");
const { filters } = require("../../../helper/filters-list.js");

// ================== CONFIG IN ẢNH ==================
const PRINT_WIDTH = 1200;
const PRINT_HEIGHT = 1800;
const PHOTO_W = 504;
const PHOTO_H = 504;
const MARGIN_X = 77;
const START_Y = 127;
const GAP_Y = 43;
const GAP_X = 38;

// ================== BASE DIR ==================
const BASE_UPLOADS_DIR = path.join(__dirname, "../../../public/uploads");
const BASE_IMAGES_DIR = path.join(__dirname, "../../../public/images");
const ORIGINAL_DIR = path.join(BASE_UPLOADS_DIR, "original");

// ================== HELPER ==================
function getLatestOriginalPhotos(limit = 4) {
    return fs
        .readdirSync(ORIGINAL_DIR)
        .filter((f) => /^IMG_\d+\.(jpg|jpeg|png)$/i.test(f))
        .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)[0], 10);
            const numB = parseInt(b.match(/\d+/)[0], 10);
            return numA - numB; // 🔼 tăng dần
        })
        .slice(-limit); // lấy 4 ảnh CUỐI (số lớn nhất)
}

function applyFilterFunction(input, output, filterName) {
    return new Promise((resolve, reject) => {
        if (!filters[filterName]) {
            return reject(new Error("Invalid filter"));
        }

        const command = `
            magick "${input}"
            ${filters[filterName]}
            "${output}"
        `.replace(/\n/g, " ");

        exec(command, (err) => {
            if (err) return reject(err);
            resolve(output);
        });
    });
}

// ================== APPLY + MERGE ==================
module.exports.postEditSeason2 = async (req, res) => {
    try {
        const filterName = req.query.filterName || "original";
        const { selectedFrame, frameType } = req.session;
        console.log("bắt đầu áp filter");

        if (!selectedFrame) {
            return res.status(400).json({
                success: false,
                message: "Chưa chọn frame",
            });
        }

        const finalFileName = `final_${selectedFrame}_${filterName}.jpg`;
        const finalFilePath = path.join(BASE_IMAGES_DIR, finalFileName);

        // ====== CACHE HIT ======
        if (fs.existsSync(finalFilePath)) {
            console.log("cache hit");
            req.session.filterName = filterName;
            req.session.finalPhoto = `${finalFileName}`;
            return res.json({
                success: true,
                cached: true,
                finalPhoto: `${finalFileName}`,
            });
        }

        let sourceDir = ORIGINAL_DIR;

        // ====== APPLY FILTER (NẾU KHÔNG PHẢI ORIGINAL) ======
        if (filterName !== "original") {
            const filteredDir = path.join(BASE_UPLOADS_DIR, filterName);

            if (!fs.existsSync(filteredDir)) {
                fs.mkdirSync(filteredDir, { recursive: true });
            }

            const photos = getLatestOriginalPhotos(4);

            for (const photo of photos) {
                const input = path.join(ORIGINAL_DIR, photo);
                const output = path.join(filteredDir, photo);

                if (!fs.existsSync(output)) {
                    await applyFilterFunction(input, output, filterName);
                }
            }

            sourceDir = filteredDir;
        }

        // ====== MERGE ======
        const outputFileName = await mergeBigVerti(
            sourceDir,
            selectedFrame,
            frameType,
            PRINT_WIDTH,
            PRINT_HEIGHT,
            PHOTO_W,
            PHOTO_H,
            MARGIN_X,
            START_Y,
            GAP_Y,
            GAP_X,
            BASE_IMAGES_DIR,
            filterName,
        );
        const finalPhoto = `${outputFileName}`;
        req.session.filterName = filterName;
        req.session.finalPhoto = finalPhoto;
        console.log("ảnh cuối:", finalPhoto);
        return res.json({
            success: true,
            cached: false,
            finalPhoto,
        });
    } catch (err) {
        console.error("❌ postEditBigVerti error:", err);
        res.status(500).json({ success: false });
    }
};

// ================== RENDER EDIT PAGE ==================
module.exports.editSeason2 = (req, res) => {
    const finalPhoto = req.query.finalPhoto;
    const { frameType, selectedFrame } = req.session;
    if (!finalPhoto) {
        return res.status(404).send("No final photo found");
    }

    res.render("client/pages/edit.pug", {
        pageTitle: "Chỉnh sửa ảnh - Big Vertical",
        finalPhoto: `images/${finalPhoto}`,
        filters,
        frameType,
        selectedFrame,
    });
};
