document.addEventListener("DOMContentLoaded", () => {
    // Lấy tất cả các nút chọn layout và nút Tiếp tục
    const layoutBtns = document.querySelectorAll(".layout-option");
    const continueBtn = document.querySelector(".btn-continue");
    let selectedLayout = null;

    layoutBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            // 1. Xóa trạng thái "đang chọn" (viền, phóng to) của tất cả các layout khác
            layoutBtns.forEach((b) => {
                b.classList.remove("ring-4", "ring-main", "scale-105");
            });

            // 2. Thêm hiệu ứng "đang chọn" cho layout vừa bấm
            this.classList.add("ring-4", "ring-main", "scale-105");

            // 3. Lưu lại giá trị layout được chọn (từ thuộc tính data-layout)
            selectedLayout = this.getAttribute("data-layout");

            // 4. "Bật sáng" nút Tiếp tục: Xóa mờ, cho phép click
            continueBtn.classList.remove("opacity-50", "pointer-events-none");
            continueBtn.classList.add("cursor-pointer");
        });
    });

    // Xử lý sự kiện bấm nút Tiếp tục
    continueBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Ngăn hành vi chuyển trang mặc định của thẻ <a>

        // Nếu đã chọn layout thì mới chuyển trang và truyền tham số lên URL
        if (selectedLayout) {
            window.location.href = `/select-frame?selectedLayout=${selectedLayout}`;
        }
    });
});
