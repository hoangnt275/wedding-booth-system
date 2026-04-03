const video = document.getElementById("camera");
const timer = document.querySelector(".timer");

if (timer) {
    // 1. Cấu hình Camera: Ép độ phân giải cao (1920x1080)
    // Giúp ảnh preview nét hơn trên màn hình lớn
    const constraints = {
        video: { 
            width: { ideal: 1920 }, 
            height: { ideal: 1080 },
            aspectRatio: 1.777 // 16:9
        },
        audio: false,
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch((err) => {
            console.error("Camera Error:", err);
            alert("Lỗi Camera: Hãy kiểm tra dây HDMI/Webcam\n" + err.message);
        });

    let isShooting = false;

    function startCountdown(seconds = 8) {
        let timeLeft = seconds;
        timer.textContent = timeLeft;

        const interval = setInterval(async () => {
            timeLeft--; // Giảm thời gian trước

            if (timeLeft > 0) {
                // Vẫn đang đếm
                timer.textContent = timeLeft;
            } else {
                // Đã về 0 -> CHỤP
                clearInterval(interval);
                
                // Hiệu ứng Visual: Đổi chữ
                timer.textContent = "SAY CHEESE!"; 
                timer.style.color = "#ffffff"; // Đổi màu chữ báo hiệu chụp
                timer.classList.add("blink"); // Thêm class nhấp nháy nếu có CSS
                
                await takePhoto();
            }
        }, 1000);
    }

    async function takePhoto() {
        if (isShooting) return;
        isShooting = true;

        try {
            // Thông báo cho người dùng biết hệ thống đang làm việc
            // Vì backend xử lý mất khoảng 3-5s
            timer.style.fontSize = "50px"; // Thu nhỏ chữ lại chút
            timer.textContent = "Đang xử lý..."; 

            const r = await fetch("/admin/shoot", { 
                method: "POST",
                // Thêm timeout cho fetch nếu cần (optional)
                headers: { 'Content-Type': 'application/json' }
            });

            if (!r.ok) {
                // Nếu server báo lỗi (ví dụ camera busy)
                const data = await r.json();
                throw new Error(data.error || "Lỗi Server " + r.status);
            }

            // --- THÀNH CÔNG ---
            
            // 🛑 Dừng camera để giải phóng RAM trước khi chuyển trang
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(t => t.stop());
                video.srcObject = null;
            }

            // Chuyển sang trang xem lại
            window.location.href = "/retake";

        } catch (e) {
            console.error(e);
            isShooting = false; // Mở khóa để thử lại
            timer.style.color = ""; // Reset màu
            timer.textContent = "Lỗi!";
            
            // Thông báo lỗi nhẹ nhàng hơn alert
            setTimeout(() => {
                alert("Sự cố chụp ảnh: " + e.message + "\nThử lại nhé!");
                window.location.reload(); // Load lại trang để reset quy trình
            }, 100);
        }
    }

    // Bắt đầu đếm ngược ngay khi trang tải xong
    window.addEventListener("load", () => startCountdown(8));
}