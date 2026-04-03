// apps/booth/public/js/toast.js

function showToast(message, type = "error") {
    // 1. Tìm hoặc tạo Container ở góc trên bên phải
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        // Dùng Tailwind định vị: Cố định, góc trên phải, cách lề 2rem, z-index cao nhất
        container.className =
            "fixed top-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none";
        document.body.appendChild(container);
    }

    // 2. Tạo thẻ div chứa thông báo
    const toast = document.createElement("div");
    // Nếu type là error thì thêm class toast-error, ngược lại để viền vàng mặc định
    toast.className = `toast-msg ${type === "error" ? "toast-error" : ""}`;

    // Icon tùy theo loại thông báo
    const icon = type === "error" ? "⚠️" : "✨";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    // 3. Đưa vào container
    container.appendChild(toast);

    // 4. Kích hoạt hiệu ứng trượt vào (cần delay 10ms để CSS nhận diện)
    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    // 5. Tự động trượt ra và xóa khỏi DOM sau 3.5 giây
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 400); // Đợi hiệu ứng trượt ra hoàn tất mới xóa thẻ HTML
    }, 3500);
}
