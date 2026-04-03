document.addEventListener("DOMContentLoaded", () => {
    let selectedPhotos = [];
    const photoItems = document.querySelectorAll(".photo-item");
    const btnNext = document.getElementById("btn-next");

    function updateUI() {
        photoItems.forEach((item) => {
            const filename = item.dataset.filename;
            const index = selectedPhotos.indexOf(filename);
            const overlay = item.querySelector(".overlay");
            const overlaySpan = item.querySelector(".number");

            if (index !== -1) {
                // Đã chọn: Hiện lớp phủ đen và số thứ tự
                overlay.classList.remove("opacity-0");
                overlay.classList.add("opacity-100");
                overlaySpan.textContent = index + 1;
            } else {
                // Bỏ chọn: Ẩn lớp phủ đen
                overlay.classList.add("opacity-0");
                overlay.classList.remove("opacity-100");
                overlaySpan.textContent = "";
            }
        });

        // Bật/tắt nút Tiếp tục
        if (selectedPhotos.length === 4) {
            btnNext.disabled = false;
            // Xóa trạng thái mờ, thêm hiệu ứng sáng viền
            btnNext.classList.remove("opacity-50", "cursor-not-allowed");
            btnNext.classList.add(
                "cursor-pointer",
                "shadow-[0_0_20px_rgba(252,235,182,0.6)]",
            );
        } else {
            btnNext.disabled = true;
            btnNext.classList.add("opacity-50", "cursor-not-allowed");
            btnNext.classList.remove(
                "cursor-pointer",
                "shadow-[0_0_20px_rgba(252,235,182,0.6)]",
            );
        }
    }

    photoItems.forEach((item) => {
        item.addEventListener("click", () => {
            const filename = item.dataset.filename;
            const index = selectedPhotos.indexOf(filename);

            if (index !== -1) {
                selectedPhotos.splice(index, 1);
            } else {
                if (selectedPhotos.length >= 4) return;
                selectedPhotos.push(filename);
            }
            updateUI();
        });
    });

    btnNext.addEventListener("click", async () => {
        if (selectedPhotos.length !== 4) return;

        btnNext.textContent = "Đang xử lý...";
        btnNext.disabled = true;

        try {
            // ==========================================
            // NHỊP 1: GỌI API DI CHUYỂN ẢNH SANG ORIGINAL
            // ==========================================
            const moveResponse = await fetch("/api/move-image", {
                // Nhớ sửa lại URL route cho đúng với Backend của bạn
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedPhotos }),
            });
            const moveResult = await moveResponse.json();

            if (!moveResult.success) {
                throw new Error(
                    moveResult.message || "Lỗi khi di chuyển ảnh gốc",
                );
            }

            // ==========================================
            // NHỊP 2: GỌI API GHÉP ẢNH
            // ==========================================
            const mergeResponse = await fetch("/edit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedPhotos }),
            });
            const mergeResult = await mergeResponse.json();

            if (mergeResult.success) {
                window.location.href = "/edit?filterName=original";
            } else {
                if (typeof showToast === "function") {
                    showToast(mergeResult.message, "error");
                } else {
                    alert(mergeResult.message);
                }

                // Trả lại trạng thái nút
                btnNext.textContent = "Tiếp tục";
                updateUI();
            }
        } catch (error) {
            console.error("Lỗi toàn trình:", error);
            if (typeof showToast === "function") {
                showToast(error.message || "Lỗi kết nối!", "error");
            } else {
                alert(error.message || "Mất kết nối tới máy chủ!");
            }

            btnNext.textContent = "Tiếp tục";
            updateUI();
        }
    });
});
