let code = "";
const submitBtn = document.getElementById("submit-btn");

function inputNum(num) {
    if (code.length < 5) {
        code += num;
        updateDisplay();
    }
}

function deleteNum() {
    code = code.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    for (let i = 0; i < 5; i++) {
        const el = document.getElementById(`digit-${i}`);
        el.innerText = code[i] || "";
        // Hiệu ứng glow khi có số
        if (code[i]) el.classList.add("glow-text");
        else el.classList.remove("glow-text");
    }

    // Kiểm tra nút gửi
    if (code.length === 5) {
        submitBtn.classList.remove("opacity-30", "pointer-events-none");
    } else {
        submitBtn.classList.add("opacity-30", "pointer-events-none");
    }
}

async function submitCode() {
    if (code.length !== 5) return;

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.innerText = "Đợi...";
    submitBtn.classList.add("pointer-events-none");

    try {
        const response = await fetch(
            `/checkCode`, // Gọi đúng endpoint API
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: code }),
            },
        );

        const result = await response.json();

        if (result.success) {
            sessionStorage.setItem("sessionCode", code);
            // Thông báo thành công màu vàng (tùy chọn, trước khi chuyển trang)
            showToast("Mã hợp lệ! Đang chuẩn bị...", "success");

            setTimeout(() => {
                window.location.href = `/select-layout`; // Chuyển trang sau khi có phản hồi thành công
            }, 500); // Đợi 1s cho khách nhìn thấy thông báo rồi mới nhảy trang
        } else {
            // Gọi hàm Toast báo lỗi thay vì alert
            showToast(result.message || "Mã không hợp lệ!", "error");

            code = "";
            submitBtn.innerText = "Tiếp";
            updateDisplay();
        }
    } catch (err) {
        console.error("Lỗi kết nối:", err);
        // Báo lỗi kết nối
        showToast("Không thể kết nối với máy chủ!", "error");

        submitBtn.innerText = "Tiếp";
        code = "";
        updateDisplay();
    }
}
