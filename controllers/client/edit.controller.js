const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const sharp = require("sharp");
const { exec } = require("child_process");
const { filters } = require("../../helper/filters-list");

// IMPORT HÀM TỪ CONFIG MỚI TẠO (bạn nhớ kiểm tra đúng đường dẫn nhé)
const { getLayoutByCode } = require("../../helper/layout-list");

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

module.exports.postEdit = async (req, res) => {
    try {
        console.log("=== BẮT ĐẦU TEST HIỆU NĂNG ===");
        console.time("⏱️ TỔNG THỜI GIAN CHẠY");

        const filterName = req.query.filterName || "original";
        const layoutName = req.session.selectedLayout || "layout-1";
        const frameName = req.session.selectedFrame || "basic.png";

        if (!layoutName || !frameName) {
            return res
                .status(400)
                .json({ success: false, message: "Dữ liệu không hợp lệ!" });
        }

        // 1. LẤY THÔNG TIN TỪ BỘ NHỚ RAM (THAY VÌ MONGODB)
        console.time("1️⃣ Thời gian đọc Config Layout");
        const layoutData = getLayoutByCode(layoutName);
        console.log("layout:", layoutData.layoutCode);
        console.timeEnd("1️⃣ Thời gian đọc Config Layout");

        if (
            !layoutData ||
            !layoutData.coordinates ||
            layoutData.coordinates.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Không tìm thấy cấu hình Layout trong layout-list!",
            });
        }

        // Gán mảng coordinates từ config sang biến slots để code phía dưới giữ nguyên logic
        // Chú ý: trong layout-list mình đang dùng field 'id', nên có thể sort theo id nếu cần
        const slots = layoutData.coordinates.sort((a, b) => a.id - b.id);

        const baseUploadsDir = path.join(process.cwd(), "public", "uploads");
        const originalDir = path.join(baseUploadsDir, "original");
        const allFiles = await fsPromises.readdir(originalDir);

        // 2. Lấy số lượng ảnh cần ghép dựa vào cấu hình layout (linh hoạt hơn việc hardcode số 4)
        const photoCountToMerge = layoutData.photoCount || 4;

        const photos = allFiles
            .filter((file) => file.match(/\.(jpg|jpeg|png)$/i))
            .slice(0, photoCountToMerge);

        if (photos.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Không tìm thấy ảnh nào trong thư mục original!",
            });
        }

        const framePath = path.join(
            process.cwd(),
            "public",
            "frames",
            layoutName,
            frameName,
        );
        const outputDir = path.join(process.cwd(), "public", "images");

        console.time("2️⃣ Thời gian tạo thư mục I/O");
        await fsPromises.mkdir(outputDir, { recursive: true });
        console.timeEnd("2️⃣ Thời gian tạo thư mục I/O");

        const outputFilename = `final_${filterName}.jpg`;
        const outputPath = path.join(outputDir, outputFilename);

        // ====== CACHE HIT ======
        if (fs.existsSync(outputPath)) {
            console.log("⚡ cache hit");
            req.session.filterName = filterName;
            req.session.finalPhoto = outputFilename;
            return res.json({
                success: true,
                cached: true,
                mergedPhotoUrl: `/images/${outputFilename}`,
            });
        }

        let sourceDir = originalDir;
        if (filterName !== "original") {
            const filteredDir = path.join(baseUploadsDir, filterName);

            if (!fs.existsSync(filteredDir)) {
                fs.mkdirSync(filteredDir, { recursive: true });
            }

            for (const photo of photos) {
                const input = path.join(originalDir, photo);
                const output = path.join(filteredDir, photo);

                if (!fs.existsSync(output)) {
                    await applyFilterFunction(input, output, filterName);
                }
            }
            sourceDir = filteredDir;
        }

        console.time("3️⃣ Thời gian Resize ảnh con (Sharp)");
        const layers = await Promise.all(
            photos.map(async (filename, i) => {
                const photoPath = path.join(sourceDir, filename);
                const resizedBuffer = await sharp(photoPath)
                    .resize(slots[i].width, slots[i].height, {
                        fit: "cover",
                        position: "centre",
                    })
                    .toBuffer();
                return {
                    input: resizedBuffer,
                    top: slots[i].y,
                    left: slots[i].x,
                };
            }),
        );
        console.timeEnd("3️⃣ Thời gian Resize ảnh con (Sharp)");

        console.time("4️⃣ Thời gian Composite và Lưu file (Sharp)");
        await sharp(framePath)
            .composite(
                layers.map((layer) => ({
                    ...layer,
                    top: Math.round(layer.top),
                    left: Math.round(layer.left),
                })),
            )
            .jpeg({ quality: 90 })
            .toFile(outputPath);
        console.timeEnd("4️⃣ Thời gian Composite và Lưu file (Sharp)");

        console.timeEnd("⏱️ TỔNG THỜI GIAN CHẠY");
        console.log("===============================");
        req.session.finalPhoto = outputFilename;
        return res.json({
            success: true,
            cached: false,
            mergedPhotoUrl: `/images/${outputFilename}`,
        });
    } catch (error) {
        console.error("❌ Lỗi khi ghép ảnh:", error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
    }
};

module.exports.edit = (req, res) => {
    try {
        const filterName = req.query.filterName || "original";
        // Lấy sessionCode để render ảnh chuẩn xác (tránh dùng hardcode 12345)
        const mergedPhotoUrl = `/images/final_${filterName}.jpg`;

        res.render("client/pages/select-filter", {
            mergedPhotoUrl: mergedPhotoUrl,
            filterName: filterName,
        });
    } catch (error) {
        console.error("Lỗi render trang filter:", error);
        res.redirect("/");
    }
};
