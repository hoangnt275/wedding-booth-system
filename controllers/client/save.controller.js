require("dotenv").config();
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data"); // 🔥 Đã thêm: THƯ VIỆN ĐỂ XỬ LÝ GỬI FILE
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const REMOVE_BG_API_URL = "https://api.remove.bg/v1.0/removebg";
// 🔥 Đã thêm: Khai báo biến API Key của Remove.bg
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

let count = 0;
let currentStickerName = "";

module.exports.index = async (req, res) => {
    const imgURL = req.body.img;
    const frameType = req.body.frameType;
    const base64Data = imgURL.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        ""
    );

    // Lưu ảnh gốc
    const fileName = `photo-${count + 1}-${Date.now()}.png`;
    const filePath = path.join(__dirname, "../../public/uploads", fileName);
    fs.writeFileSync(filePath, base64Data, "base64");

    // Xử lý AI (Chạy ngầm)
    if (count === 0) {
        const timestamp = Date.now();
        currentStickerName = `chibi-${timestamp}.png`;

        processAI(filePath, currentStickerName).catch((err) =>
            // Log lỗi chi tiết của Axios
            console.error("❌ Lỗi chạy ngầm:", err.message)
        );
    }

    count++;

    // Hàm xử lý AI dùng Cloud API
    async function processAI(inputFilePath, outputFileName) {
        try {
            console.log("🤖 B1: Gemini phân tích...");
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
            });
            const imageBuffer = fs.readFileSync(inputFilePath);

            const prompt = `Describe this person for a Chibi sticker. Gender, hair, clothes, expression. Start with "A chibi sticker of...". Max 25 words.`;
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
                "🎨 B2: Pollinations vẽ (Phong cách Profile Picture)..."
            );

            // 🔥 CÁC THAY ĐỔI PROMPT QUAN TRỌNG:
            // Thêm từ khóa "profile picture", "flat design", "muted colors"
            const styleTags =
                "profile picture, simple flat cartoon, smooth shading, thick clean outline, soft muted colors, minimalist vector illustration";

            // Chúng ta không cần ép "white background" nữa, thay vào đó ép nền "soft pastel background"
            // vì ảnh mẫu của bạn có nền màu da/kem.
            const finalPrompt = `${description}, ${styleTags}, white background`;

            const encodedPrompt = encodeURIComponent(finalPrompt);

            // Giữ nguyên model 'flux-anime' vì nó thường phản hồi tốt với các chỉ dẫn style mạnh
            const generateUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&model=flux-anime&seed=${Date.now()}&nologo=true`;
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
                }
            );

            // Lưu file
            const stickerPath = path.join(
                __dirname,
                "../../public/sticker",
                outputFileName
            );
            fs.writeFileSync(stickerPath, removeBgResponse.data);

            console.log("✅ Xong! Sticker đã lưu tại:", outputFileName);
        } catch (err) {
            console.error(
                "❌ Lỗi AI:",
                err.response ? err.response.data.toString() : err.message
            );
        }
    }

    // --- Logic điều hướng (Client nhận response ngay lập tức) ---
    // Cần phải gửi kèm currentStickerName để Client biết tên file mà thăm dò (polling)

    const responseData = {
        stickerName: currentStickerName,
        redirectUrl: "",
    };

    if (count >= 4) {
        count = 0;
        if (frameType == "hori") responseData.redirectUrl = "/editHori";
        else if (frameType == "verti") responseData.redirectUrl = "/editVerti";
        else if (frameType == "small") responseData.redirectUrl = "/editSmall";
    } else {
        responseData.redirectUrl =
            frameType == "hori"
                ? "/shootHori"
                : frameType == "verti"
                ? "/shootVerti"
                : "/shootSmall";
    }

    return res.json(responseData);
};
