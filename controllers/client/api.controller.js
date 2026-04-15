const fs = require("fs");
const path = require("path");
const { print, getPrinters } = require("@00f100/pdf-to-printer");
const sharp = require("sharp");
const os = require("os");
const uploadPhoto = require("../../helper/uploadtor2");
require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data"); // 🔥 Đã thêm: THƯ VIỆN ĐỂ XỬ LÝ GỬI FILE
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const REMOVE_BG_API_URL = "https://api.remove.bg/v1.0/removebg";
// 🔥 Đã thêm: Khai báo biến API Key của Remove.bg
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

const imagesDir = path.join(__dirname, "../../public/uploads/original");
module.exports.countImage = (req, res) => {
    try {
        const files = fs.readdirSync(imagesDir);
        const imageCount = files.length;
        console.log(`📸 Total images taken: ${imageCount}`);
        req.session.retakeCount = 0;
        res.json({ count: imageCount });
    } catch (err) {
        console.error("❌ COUNT IMAGE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports.uploadToR2 = async (req, res) => {
    try {
        const { finalPhoto, filterName } = req.session;
        const eventSlug = req.session.eventSlug || "default-wedding";

        if (!finalPhoto || !filterName) {
            return res.status(500).json({ error: "Thiếu dữ liệu session" });
        }

        // 1. Tạo sessionCode theo GiờPhútGiây
        const now = new Date();
        const sessionCode = 
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0');

        // LƯU VÀO SESSION ĐỂ TRANG PRINTING SỬ DỤNG TẠO MÃ QR
        req.session.sessionCode = sessionCode;

        const finalPhotoPath = path.join(__dirname, "../../public/images", finalPhoto.replace(/^\/+/, ""));
        const uploadsPhotoPath = path.join(__dirname, "../../public/uploads", filterName);

        try {
            // 2. Upload ảnh chính với tên "final.jpg"
            await uploadPhoto({ 
                filePath: finalPhotoPath, 
                eventSlug, 
                sessionCode,
                fileName: "final.jpg" // Đặt tên file là final.jpg
            });

            // 3. Upload các ảnh lẻ với tên "photo-1.jpg", "photo-2.jpg"...
            const files = fs.readdirSync(uploadsPhotoPath);
            const imageFiles = files.filter((file) => [".jpg", ".jpeg", ".png"].includes(path.extname(file).toLowerCase()));

            for (let i = 0; i < imageFiles.length; i++) {
                const fullPath = path.join(uploadsPhotoPath, imageFiles[i]);
                await uploadPhoto({
                    filePath: fullPath,
                    eventSlug,
                    sessionCode,
                    fileName: `photo-${i + 1}.jpg` // Đặt tên file là photo-1, photo-2...
                });
            }
        } catch (error) {
            console.error("Lỗi trong quá trình upload:", error);
        }
        
        res.json({ success: true, sessionCode, eventSlug }); 
    } catch (err) {
        console.error("Upload to R2 failed:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports.genSticker = async (req, res) => {
    // Hàm xử lý AI dùng Cloud API
    const code = req.session.code;
    const imagesDir = path.join(__dirname, "../../public/uploads/original");
    const photoName = fs.readdirSync(imagesDir);
    const inputPath = path.join(imagesDir, photoName[0]);
    const outputFileName = `sticker_${code}.png`;

    processAI(inputPath, outputFileName).catch((err) =>
        // Log lỗi chi tiết của Axios
        console.error("❌ Lỗi chạy ngầm:", err.message),
    );

    async function processAI(inputFilePath, outputFileName) {
        try {
            console.log("🤖 B1: Gemini phân tích...");
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
            });
            const imageBuffer = fs.readFileSync(inputFilePath);

            const prompt = `Describe this person as a cute cartoon chibi avatar sticker.
First, clearly identify gender (male or female).
Use gender-appropriate facial features and hairstyle.
Focus on hairstyle, glasses, clothing, facial expression.
Use simple words.
Do NOT mention realism or anime.
Start exactly with: "A cute chibi cartoon sticker of a male..." OR "A cute chibi cartoon sticker of a female..."
Max 20 words.`;
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: imageBuffer.toString("base64"),
                        mimeType: "image/png",
                    },
                },
            ]);
            const description = result.response.text().trim();
            console.log("📝 Mô tả:", description);

            // --- B2: Pollinations vẽ ---
            console.log(
                "🎨 B2: Pollinations vẽ (Phong cách Profile Picture)...",
            );

            // 🔥 CÁC THAY ĐỔI PROMPT QUAN TRỌNG:
            // Thêm từ khóa "profile picture", "flat design", "muted colors"
            const styleTags =
                "cute chibi cartoon avatar,big head small body,simple face,small eyes,thick clean outline,flat color illustration,minimal shading,rounded shapes,LINE sticker style,vector cartoon,clean background,no texture,no realism,no anime,clear mouth outline,visible mouth line,soft pink mouth int,gender accurate features,keep original gender";

            // Chúng ta không cần ép "white background" nữa, thay vào đó ép nền "soft pastel background"
            // vì ảnh mẫu của bạn có nền màu da/kem.
            const finalPrompt = `${description},${styleTags},white background,`;

            const encodedPrompt = encodeURIComponent(finalPrompt);

            // Giữ nguyên model 'flux-anime' vì nó thường phản hồi tốt với các chỉ dẫn style mạnh
            const generateUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&model=flux&seed=${Date.now()}&nologo=true`;

            const pollResponse = await axios.get(generateUrl, {
                responseType: "arraybuffer",
            });
            const pngBuffer = pollResponse.data;

            // --- B3: Remove.bg xóa phông ---
            console.log("✂️ B3: Remove.bg xóa phông...");

            // 🔥 TẠO FORM DATA
            const formData = new FormData();
            // Lưu ý: Key remove.bg nhận cả Buffer ảnh (binary)
            formData.append("image_file", pngBuffer, "chibi_temp.png");
            formData.append("size", "auto");
            formData.append("type", "person");

            const removeBgResponse = await axios.post(
                REMOVE_BG_API_URL,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(), // Lấy headers chuẩn cho FormData (Boundary)
                        "X-Api-Key": REMOVE_BG_API_KEY, // Sử dụng biến đã khai báo
                    },
                    responseType: "arraybuffer",
                    timeout: 45000,
                },
            );

            // Lưu file
            const stickerPath = path.join(
                __dirname,
                "../../public/sticker",
                outputFileName,
            );
            fs.writeFileSync(stickerPath, removeBgResponse.data);

            console.log("✅ Xong! Sticker đã lưu tại:", outputFileName);
        } catch (err) {
            console.error(
                "❌ Lỗi AI:",
                err?.response?.data?.toString() || err.message,
            );
        }
    }
};
module.exports.print = async (req, res) => {
    let tempFilePath = null;
    const requestedCount = parseInt(req.query.printCount, 10) || 1;
    try {
        const { paperSize, finalPhoto } = req.session;
        const BASE_IMAGES_DIR = path.join(__dirname, "../../public/images");
        let printFinalPath = path.join(BASE_IMAGES_DIR, finalPhoto);
        if (paperSize === "SMALL") {
            const singleStripPath = path.join(BASE_IMAGES_DIR, finalPhoto);
            const printFileName = `print_${finalPhoto}`;
            printFinalPath = path.join(BASE_IMAGES_DIR, printFileName);
            // 2. Tạo tên file cho ảnh in (Double Strip - 4x6)
            // Ví dụ: outputFileName = "final_frame1_bw.jpg"
            // -> printFileName = "print_final_frame1_bw.jpg"

            await sharp({
                create: {
                    width: 1200,
                    height: 1800,
                    channels: 3,
                    background: { r: 255, g: 255, b: 255 }, // Nền trắng
                },
            })
                .composite([
                    { input: singleStripPath, top: 0, left: 0 }, // Dải trái
                    { input: singleStripPath, top: 0, left: 600 }, // Dải phải
                ])
                .jpeg({ quality: 95, mozjpeg: true })
                .toFile(printFinalPath);
        } else {
            printFinalPath = path.join(BASE_IMAGES_DIR, finalPhoto);
        }
        // --- 1. CẤU HÌNH (Sửa lại cho khớp máy bạn) ---
        let PRINTER_NAME;
        if (paperSize === "SMALL") {
            PRINTER_NAME = "DSRX1_STRIP_CUT";
        } else {
            PRINTER_NAME = "DSRX1_4x6_NOCUT";
        }

        console.log(PRINTER_NAME); // Tên máy in đã cài driver sẵn trong Windows

        // setting driver "landscape" và "PR 4x6"

        const IS_DRIVER_LANDSCAPE = true;

        // Kích thước chuẩn 4x6 inch @ 300dpi

        const PAGE_WIDTH = IS_DRIVER_LANDSCAPE ? 1800 : 1200;

        const PAGE_HEIGHT = IS_DRIVER_LANDSCAPE ? 1200 : 1800;

        // --- 2. FILE INPUT & OUTPUT ---

        const timestamp = Date.now();

        tempFilePath = path.join(
            __dirname,

            `../../public/images/print_temp_${timestamp}.jpg`,
        );

        if (!fs.existsSync(printFinalPath))
            throw new Error("Không tìm thấy file ảnh gốc!");

        console.log(
            `[1] Đang xử lý ảnh trên Windows 64-bit... Target: ${PAGE_WIDTH}x${PAGE_HEIGHT}`,
        );

        // --- 3. XỬ LÝ ẢNH THÔNG MINH (SHARP) ---

        const metadata = await sharp(printFinalPath).metadata();

        const isImgLandscape = metadata.width > metadata.height;

        // A. Logic Auto-Rotate (Giống dslrBooth)

        // Nếu ảnh và Driver lệch pha nhau -> Xoay 90 độ

        let needRotate = false;

        if (IS_DRIVER_LANDSCAPE && !isImgLandscape) needRotate = true; // Driver Ngang mà ảnh Dọc -> Xoay

        if (!IS_DRIVER_LANDSCAPE && isImgLandscape) needRotate = true; // Driver Dọc mà ảnh Ngang -> Xoay

        console.log(
            `--> Auto-rotate: ${needRotate ? "CÓ (Xoay 90)" : "KHÔNG"}`,
        );

        // B. Logic Smart Scale 97% (Giống dslrBooth)

        // Thu nhỏ ảnh lại 3% để chừa biên an toàn, sau đó dán vào nền trắng chuẩn size

        const innerWidth = Math.round(PAGE_WIDTH * 0.97); // 97% chiều ngang

        const innerHeight = Math.round(PAGE_HEIGHT * 0.97); // 97% chiều dọc

        await sharp(printFinalPath)
            .rotate(needRotate ? 90 : 0) // Xoay nếu cần

            .resize(1850, 1230, {
                fit: "fill", // Ép ảnh đúng size này, không thừa không thiếu
            })

            .withMetadata({ density: 300 }) // Set DPI 300 cho DNP

            .jpeg({ quality: 100 })

            .toFile(tempFilePath);

        console.log(`[2] Đã tạo file in chuẩn: ${tempFilePath}`);

        // --- 4. TÍNH TOÁN SỐ LƯỢNG & GỬI LỆNH IN ---
        let sheetsUsed = requestedCount; // Số tờ giấy 4x6 thực tế máy in phải nuốt
        let actualYield = requestedCount; // Số tấm ảnh thực tế khách nhận được

        // Nếu in dải SMALL (tự động cắt đôi 4x6 thành 2x6)
        if (paperSize === "SMALL") {
            sheetsUsed = Math.ceil(requestedCount / 2); // Khách chọn 5 -> Cần 3 tờ 4x6
            actualYield = sheetsUsed * 2; // 3 tờ 4x6 -> Cắt ra được 6 tấm
            console.log(
                `[Info] Khách yêu cầu ${requestedCount} tấm nhỏ. Máy sẽ cắt ${sheetsUsed} tờ 4x6 để ra ${actualYield} tấm.`,
            );
        }

        console.log(
            `[3] Gửi lệnh in tới: ${PRINTER_NAME} - Tốn ${sheetsUsed} giấy.`,
        );

        await print(tempFilePath, {
            printer: PRINTER_NAME,
            // Các tham số dòng lệnh dành riêng cho Windows (SumatraPDF engine)
            win32: [
                // 👉 Đã sửa thành ${sheetsUsed}x để báo máy in đúng số lượng tờ 4x6
                `-print-settings "${sheetsUsed}x,${IS_DRIVER_LANDSCAPE ? "landscape" : "portrait"},fit"`,
                "-silent",
            ],
        });

        // --- 5. LƯU THỐNG KÊ VÀO FILE JSON ---
        try {
            const statsFilePath = path.join(
                __dirname,
                "../../public/data/stats.json",
            );

            // Cấu trúc mặc định nếu file chưa có gì
            let stats = {
                totalSessions: 0,
                totalSheetsUsed: 0,
                totalSmallStrips: 0,
                totalLargePhotos: 0,
            };

            // Đọc dữ liệu cũ (nếu có)
            if (fs.existsSync(statsFilePath)) {
                const rawData = fs.readFileSync(statsFilePath, "utf8");
                if (rawData.trim() !== "") {
                    stats = JSON.parse(rawData);
                }
            }

            // Cộng dồn
            stats.totalSessions += 1;
            stats.totalSheetsUsed += sheetsUsed; // Cộng số giấy 4x6 tiêu hao

            if (paperSize === "SMALL") {
                stats.totalSmallStrips += actualYield; // Cộng số dải ảnh nhỏ 2x6
            } else {
                stats.totalLargePhotos += actualYield; // Cộng số ảnh to 4x6
            }

            // Ghi đè lại file
            fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
            console.log(
                `[Thống kê] Đã lưu! Tổng lượt chụp: ${stats.totalSessions} | Tổng giấy tiêu hao tới hiện tại: ${stats.totalSheetsUsed} tờ.`,
            );
        } catch (statsErr) {
            console.error(
                "Lỗi khi lưu thống kê vào stats.json:",
                statsErr.message,
            );
        }

        // --- 6. TRẢ KẾT QUẢ VỀ CHO FRONT-END ---
        res.json({
            success: true,
            message: `Đã in xong ${actualYield} ảnh`,
        });
    } catch (err) {
        console.error("Lỗi in ấn:", err);

        res.status(500).json({ success: false, message: err.message });
    }
};
module.exports.delete = async (req, res) => {
    try {
        const fs = require("fs/promises");
        const publicDir = path.join(__dirname, "../../public");

        const imagesDir = path.join(publicDir, "images");
        const uploadsDir = path.join(publicDir, "uploads");
        const rawDir = path.join(uploadsDir, "raw");
        const originalDir = path.join(uploadsDir, "original");

        // 1. Dọn sạch folder images (Xóa rồi tạo lại cho nhanh)
        await fs
            .rm(imagesDir, { recursive: true, force: true })
            .catch(() => null);
        await fs.mkdir(imagesDir, { recursive: true });
        console.log("--> Đã dọn sạch images");

        // 2. Dọn sạch folder uploads (Xóa toàn bộ folder uploads cũ)
        await fs
            .rm(uploadsDir, { recursive: true, force: true })
            .catch(() => null);
        console.log("--> Đã dọn sạch uploads");

        // 3. Tạo lại cấu trúc thư mục rỗng: uploads/raw và uploads/original
        // Sử dụng { recursive: true } để tạo luôn folder cha 'uploads'
        await fs.mkdir(rawDir, { recursive: true });
        await fs.mkdir(originalDir, { recursive: true });
        console.log(
            "--> Đã khởi tạo lại cấu trúc: uploads/raw và uploads/original",
        );

        return res.json({
            success: true,
            message:
                "Hệ thống đã dọn dẹp sạch sẽ. Sẵn sàng cho khách tiếp theo.",
        });
    } catch (err) {
        console.error("Lỗi khi dọn dẹp dữ liệu:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + err.message,
        });
    }
};
// Đừng quên import getLayoutByCode nếu bạn muốn lấy số lượng ảnh động
const { getLayoutByCode } = require("../../helper/layout-list");

module.exports.moveImages = async (req, res) => {
    try {
        // Gọi module fs/promises trực tiếp trong hàm này để xài await cho an toàn
        const fsPromises = require("fs/promises");

        const { selectedPhotos } = req.body;

        // --- 1. LẤY SỐ LƯỢNG ẢNH TỪ LAYOUT CONFIG ---
        const layoutName = req.session.selectedLayout || "large_basic";
        const layoutConfig = getLayoutByCode(layoutName);
        const requiredCount = layoutConfig ? layoutConfig.photoCount : 4;

        // Bắt lỗi nếu khách không chọn đủ số ảnh theo layout
        if (!selectedPhotos || selectedPhotos.length !== requiredCount) {
            return res.status(400).json({
                success: false,
                message: `Vui lòng chọn đủ ${requiredCount} ảnh!`,
            });
        }

        const rawDir = path.join(process.cwd(), "public", "uploads", "raw");
        const originalDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            "original",
        );

        // --- 2. TẠO THƯ MỤC VÀ CHUYỂN ẢNH (DÙNG FSPROMISES) ---
        // Đảm bảo thư mục đích đã tồn tại (dùng hàm promise chuẩn)
        await fsPromises.mkdir(originalDir, { recursive: true });

        // Di chuyển đồng loạt các file
        await Promise.all(
            selectedPhotos.map(async (filename) => {
                const oldPath = path.join(rawDir, filename);
                const newPath = path.join(originalDir, filename);

                try {
                    // Dùng fsPromises để await việc kiểm tra và di chuyển file
                    await fsPromises.access(oldPath);
                    await fsPromises.rename(oldPath, newPath);
                } catch (err) {
                    console.warn(
                        `[Cảnh báo] Không tìm thấy file gốc: ${filename}`,
                    );
                }
            }),
        );

        res.json({ success: true, message: "Đã di chuyển ảnh thành công!" });
    } catch (error) {
        console.error("Lỗi khi chuyển ảnh:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi hệ thống khi di chuyển ảnh!",
        });
    }
};
