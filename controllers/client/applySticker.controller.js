const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// =====================
// [GET] /apply-sticker
// =====================
module.exports.applySticker = (req, res) => {
    const { finalPhoto, code } = req.session;

    // URL gửi ra client
    const stickerUrl = `/sticker/sticker_${code}.png`;

    // Path vật lý trong public
    const physicalPath = path.join(
        __dirname,
        "../../public",
        "sticker",
        `sticker_${code}.png`
    );

    let stickerPath = null;
    if (fs.existsSync(physicalPath)) {
        stickerPath = stickerUrl;
    }

    res.render("client/pages/applySticker", {
        pageTitle: "Trang sticker",
        finalPhoto: `/images/${path.basename(finalPhoto)}`,
        stickerPath,
    });
};

// =====================
// [POST] /apply-sticker
// =====================
module.exports.postApplySticker = async (req, res) => {
    try {
        const { stickerName } = req.query; // vd: "sticker_01.png" | "none"
        const { finalPhoto, frameType } = req.session;

        const publicDir = path.join(__dirname, "../../public");

        // =====================
        // 1. CHUẨN HÓA TÊN FILE
        // =====================
        const cleanName = path.basename(finalPhoto); // photo.jpg | photo_sticker.jpg
        const ext = path.extname(cleanName);
        const baseName = cleanName
            .replace(`_sticker${ext}`, "")
            .replace(ext, "");

        // Ảnh gốc (chưa sticker)
        const originalPhotoPath = path.join(
            publicDir,
            "images",
            `${baseName}${ext}`
        );

        const originalPhotoUrl = `/images/${baseName}${ext}`;

        // =====================
        // 2. TRƯỜNG HỢP "KHÔNG"
        // =====================
        if (stickerName === "none") {
            req.session.finalPhoto = `${baseName}${ext}`;
            return res.json({
                success: true,
                finalPhoto: originalPhotoUrl,
            });
        }

        // =====================
        // 3. FILE STICKER
        // =====================
        const stickerPath = path.join(publicDir, "sticker", stickerName);

        if (!fs.existsSync(stickerPath)) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sticker",
            });
        }

        // =====================
        // 4. FILE OUTPUT
        // =====================
        const finalStickerName = `${baseName}_sticker${ext}`;
        const finalStickerPath = path.join(
            publicDir,
            "images",
            finalStickerName
        );
        const finalStickerUrl = `/images/${finalStickerName}`;

        // Cache hit → khỏi xử lý lại
        if (fs.existsSync(finalStickerPath)) {
            req.session.finalPhoto = finalStickerName;
            return res.json({
                success: true,
                finalPhoto: finalStickerUrl,
            });
        }

        // =====================
        // 5. CHECK ẢNH GỐC
        // =====================
        if (!fs.existsSync(originalPhotoPath)) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy ảnh gốc",
            });
        }

        // =====================
        // 6. TỌA ĐỘ STICKER
        // =====================
        let top = 0,
            left = 0;

        if (frameType === "small" || frameType === "season1") {
            top = 1480;
            left = 290;
        } else if (frameType === "bigVerti" || frameType === "season2") {
            top = 1480;
            left = 870;
        }

        // =====================
        // 7. GHÉP STICKER
        // =====================
        await sharp(originalPhotoPath)
            .composite([
                {
                    input: await sharp(stickerPath)
                        .resize(300, 300)
                        .toBuffer(),
                    top,
                    left,
                },
            ])
            .jpeg({ quality: 90 })
            .toFile(finalStickerPath);

        req.session.finalPhoto = finalStickerName;

        return res.json({
            success: true,
            finalPhoto: finalStickerUrl,
        });
    } catch (error) {
        console.error("Lỗi postApplySticker:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi xử lý ảnh",
        });
    }
};
