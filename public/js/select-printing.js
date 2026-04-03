// Import Loading dưới dạng ES6 Module
import Loading from "../helper/loading.js";

document.addEventListener("DOMContentLoaded", () => {
    // Lấy các DOM Elements
    const btnMinus = document.getElementById("btn-minus");
    const btnPlus = document.getElementById("btn-plus");
    const printCountDisplay = document.getElementById("print-count");
    const btnFinish = document.getElementById("btn-finish");

    // Khởi tạo biến đếm và giới hạn
    let count = 1;
    const MIN = 1;
    const MAX = 15;

    // Hàm cập nhật số lượng lên màn hình
    const updateDisplay = () => {
        printCountDisplay.innerText = count;

        // Logic phụ: Làm mờ nút nếu chạm đáy/chạm đỉnh (UI UX tốt hơn)
        btnMinus.style.opacity = count === MIN ? "0.5" : "1";
        btnPlus.style.opacity = count === MAX ? "0.5" : "1";
    };

    // Khởi tạo hiển thị ban đầu
    updateDisplay();

    // Sự kiện NÚT TRỪ
    btnMinus.addEventListener("click", () => {
        if (count > MIN) {
            count--;
            updateDisplay();
        }
    });

    // Sự kiện NÚT CỘNG
    btnPlus.addEventListener("click", () => {
        if (count < MAX) {
            count++;
            updateDisplay();
        }
    });

    // Sự kiện NÚT TIẾP TỤC
    btnFinish.addEventListener("click", async () => {
        try {
            // Khóa nút để tránh spam click
            btnFinish.classList.add("opacity-50", "pointer-events-none");
            btnFinish.innerText = "Đang gửi...";

            // BẬT LOADING
            if (typeof Loading !== "undefined") Loading.show();

            // Gọi API in ảnh (POST request)
            const response = await fetch(`/api/print?printCount=${count}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Tùy theo cách API /api/print của bạn trả về. Thường là response.ok hoặc check json
            if (response.success === true) {
                // TẮT LOADING (Tuỳ chọn: nếu trang /printing tải nhanh thì có thể bỏ qua dòng này để chuyển trang luôn cho mượt)
                // if(typeof Loading !== 'undefined') Loading.hide();
                await fetch("/api/uploadToR2", { method: "POST" });
                // Chuyển tới màn hình in/QR kết thúc
                window.location.href = "/printing";
            } else {
                // Xử lý lỗi nếu máy in / API báo lỗi
                alert("Lỗi máy in! Vui lòng thử lại.");
                btnFinish.classList.remove("opacity-50", "pointer-events-none");
                btnFinish.innerText = "Tiếp tục";
                if (typeof Loading !== "undefined") Loading.hide();
            }
        } catch (error) {
            console.error(error);
            alert("Mất kết nối tới máy in!");
            btnFinish.classList.remove("opacity-50", "pointer-events-none");
            btnFinish.innerText = "Tiếp tục";
            if (typeof Loading !== "undefined") Loading.hide();
        }
    });
});
