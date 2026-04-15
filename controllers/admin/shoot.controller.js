const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// ===== CONFIG =====
const AHK_PATH = "C:/Program Files/AutoHotkey/AutoHotkey.exe";
const SCRIPT_PATH = path.join(__dirname, "../../ahk/capture.ahk");
const ORIGINAL_DIR = path.join(__dirname, "../../public/uploads/original");

// ===== STATE CONTROL (LOCK) =====
// Biến này đảm bảo dù Frontend có lỡ gọi 2 lần thì Server chỉ chụp 1 tấm
let isShooting = false;

// ===== HELPER FUNCTIONS =====

// Hàm đợi (Sleep)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Tạo thư mục nếu chưa có
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Chạy AHK để kích hoạt máy ảnh
function runAHK() {
    return new Promise((resolve, reject) => {
        // WindowsHide: true để không bị nháy màn hình đen
        const p = spawn(AHK_PATH, [SCRIPT_PATH, "shoot"], {
            windowsHide: true,
        });

        // TIMEOUT AN TOÀN: Nếu 10s máy ảnh không chụp, tự hủy để không treo phần mềm
        const timeout = setTimeout(() => {
            p.kill();
            reject(new Error("Camera Timeout: Máy ảnh không phản hồi sau 10s"));
        }, 10000);

        p.on("error", (err) => {
            clearTimeout(timeout);
            reject(err);
        });

        p.on("exit", (code) => {
            clearTimeout(timeout);
            if (code === 0) resolve();
            else reject(new Error(`AHK lỗi với mã: ${code}`));
        });
    });
}

// Đợi ảnh mới xuất hiện (Có Timeout thoát hiểm)
async function waitForNewImage(dir, beforeFilesSet, timeout = 12000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        // Đọc danh sách file hiện tại
        const files = fs
            .readdirSync(dir)
            .filter((f) => /\.(jpe?g|png)$/i.test(f));

        // Tìm file nào KHÔNG có trong danh sách cũ (beforeFilesSet)
        const newFile = files.find((f) => !beforeFilesSet.has(f));

        if (newFile) return newFile;

        // Đợi 200ms rồi check lại (nhanh và nhẹ máy)
        await sleep(200);
    }
    throw new Error(
        "Không tìm thấy ảnh mới (Kiểm tra kết nối USB/Pin máy ảnh)",
    );
}

// Đợi file ghi xong hoàn toàn (Size không đổi)
async function waitForStableFile(filePath, interval = 200, maxWait = 5000) {
    let lastSize = -1;
    const start = Date.now();

    while (Date.now() - start < maxWait) {
        try {
            const { size } = fs.statSync(filePath);
            // Nếu size > 0 và không đổi so với lần check trước -> File đã xong
            if (size > 0 && size === lastSize) return;
            lastSize = size;
        } catch (e) {
            // Bỏ qua lỗi nếu file đang bị lock (Windows behavior)
        }
        await sleep(interval);
    }
    // Hết thời gian mà file vẫn đang ghi dở -> Vẫn cho qua nhưng log warning
    console.warn("⚠️ Cảnh báo: File có thể chưa ghi xong hoàn toàn.");
}

// Xử lý ảnh: Lật gương + Overwrite (Cực kỳ quan trọng trên Windows)
async function processImage(imagePath) {
    const tmpPath = imagePath + ".tmp"; // File tạm

    // RETRY LOGIC: Thử 3 lần. Vì Windows hay khóa file vừa chụp xong.
    // Nếu không có retry, phần mềm sẽ crash ngẫu nhiên.
    for (let i = 1; i <= 3; i++) {
        try {
            // 1. Lật ảnh sang file tạm
            await sharp(imagePath).flop().toFile(tmpPath);

            // 2. Xóa file gốc (Cần thiết trên Windows để tránh lỗi EPERM)
            // Thử xóa, nếu lỗi thì bỏ qua
            try {
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            } catch (e) {}

            // 3. Đổi tên file tạm thành file gốc
            fs.renameSync(tmpPath, imagePath);

            return; // Thành công -> Thoát
        } catch (err) {
            console.log(`⚠️ Lỗi xử lý ảnh lần ${i}, đang thử lại...`);
            await sleep(500); // Đợi 0.5s rồi thử lại
            if (i === 3) throw err; // Lần 3 vẫn lỗi thì báo lỗi hẳn
        }
    }
}

// ===== MAIN CONTROLLER =====
module.exports.shoot = async (req, res) => {
    // 1️⃣ CHECK LOCK: Nếu đang xử lý shot trước, từ chối shot này
    if (isShooting) {
        return res.status(429).json({
            ok: false,
            error: "System is busy processing previous shot",
        });
    }

    isShooting = true; // 🔒 KHÓA

    try {
        ensureDir(ORIGINAL_DIR);

        // 2️⃣ SNAPSHOT: Ghi nhớ danh sách file hiện có
        const beforeFiles = new Set(
            fs.readdirSync(ORIGINAL_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f)),
        );

        // 3️⃣ TRIGGER: Gọi AHK để chụp (Lưu ý: 8s đếm ngược nên làm ở Frontend)
        console.log("📸 Triggering Camera...");
        await runAHK();

        // 4️⃣ WATCH: Chờ file ảnh mới
        const newFileName = await waitForNewImage(ORIGINAL_DIR, beforeFiles);
        const fullPath = path.join(ORIGINAL_DIR, newFileName);

        console.log(`✅ New file detected: ${newFileName}`);

        // 5️⃣ STABILIZE: Đợi EOS Utility nhả file ra hoàn toàn
        await waitForStableFile(fullPath);

        // 6️⃣ PROCESS: Lật ảnh (Mirror) an toàn
        await processImage(fullPath);

        // 7️⃣ FINISH: Lưu session và trả kết quả
        req.session.lastPhoto = newFileName;

        return res.json({
            ok: true,
            file: newFileName,
            url: `/uploads/original/${newFileName}`, // Trả về đường dẫn để hiển thị ngay
        });
    } catch (err) {
        console.error("❌ SHOOT ERROR:", err.message);
        return res.status(500).json({ ok: false, error: err.message });
    } finally {
        isShooting = false; // 🔓 MỞ KHÓA (Luôn chạy dù lỗi hay không)
    }
};
