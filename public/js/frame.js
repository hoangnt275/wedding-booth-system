document.addEventListener("DOMContentLoaded", () => {
    // Lấy selectedLayout từ input ẩn
    const selectedLayout = document.getElementById(
        "hidden-selected-layout",
    ).value;

    const frameBtns = document.querySelectorAll(".frame-option");
    const continueBtn = document.querySelector(".btn-continue");
    let selectedFrame = null;

    // 1. Logic Chọn Khung
    frameBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            // Gỡ viền sáng của các nút khác
            frameBtns.forEach((b) => b.classList.remove("ring-4", "ring-main"));

            // Bật viền sáng cho nút được chọn
            this.classList.add("ring-4", "ring-main");
            selectedFrame = this.getAttribute("data-frame");

            // Bật nút Tiếp tục
            continueBtn.classList.remove("opacity-50", "pointer-events-none");
            continueBtn.classList.add("cursor-pointer");
        });
    });

    // 2. Logic Nút Tiếp Tục (Gọi API lưu Session)
    continueBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!selectedFrame) return;

        // Đổi chữ nút thành "Đang xử lý..." để tăng tính trải nghiệm
        const spanInsideBtn = continueBtn.querySelector("span");
        const oldText = spanInsideBtn.innerText;
        spanInsideBtn.innerText = "Đang lưu...";
        continueBtn.classList.add("opacity-50", "pointer-events-none");

        try {
            // GIẢ ĐỊNH: Route của bạn là POST /select-frame. Hãy đổi đường dẫn này nếu Route bạn khai báo khác nhé.
            const response = await fetch("/select-frame", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    selectedFrame: selectedFrame,
                    selectedLayout: selectedLayout,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Lưu session thành công, chuyển thẳng qua trang chụp!
                window.location.href = "/shoot";
            } else {
                alert("Lỗi lưu trữ! Vui lòng thử lại.");
                spanInsideBtn.innerText = oldText;
                continueBtn.classList.remove(
                    "opacity-50",
                    "pointer-events-none",
                );
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Mất kết nối! Vui lòng kiểm tra lại.");
            spanInsideBtn.innerText = oldText;
            continueBtn.classList.remove("opacity-50", "pointer-events-none");
        }
    });

    // 3. Logic cho Thanh cuộn (Custom Scrollbar) kéo thả mượt mà
    const scrollContainer = document.getElementById("frame-scroll-container");
    const scrollThumb = document.getElementById("scroll-thumb");

    if (scrollContainer && scrollThumb) {
        const track = scrollThumb.parentElement; // Khung viền chứa thanh cuộn

        // A. CẬP NHẬT VỊ TRÍ THANH TRƯỢT KHI VUỐT ẢNH
        scrollContainer.addEventListener("scroll", () => {
            const maxScrollLeft =
                scrollContainer.scrollWidth - scrollContainer.clientWidth;
            if (maxScrollLeft <= 0) return;

            const scrollPercent = scrollContainer.scrollLeft / maxScrollLeft;
            // Tính toán khoảng cách tối đa thanh thumb có thể chạy (Track width - Thumb width)
            const maxThumbMovePercent =
                ((track.clientWidth - scrollThumb.clientWidth) /
                    track.clientWidth) *
                100;

            scrollThumb.style.left = `${scrollPercent * maxThumbMovePercent}%`;
        });

        // B. LOGIC KÉO THẢ THANH TRƯỢT (CHUỘT & CẢM ỨNG)
        let isDragging = false;
        let startX;
        let scrollLeftStart;

        // 1. Khi nhấn chuột/chạm tay vào thanh trượt
        const startDrag = (e) => {
            isDragging = true;
            // Lấy toạ độ X của chuột hoặc ngón tay
            startX = e.pageX || e.touches[0].pageX;
            scrollLeftStart = scrollContainer.scrollLeft;

            // Tắt hiệu ứng transition để lúc kéo không bị trễ (lag)
            scrollThumb.classList.remove("transition-all", "duration-75");
            document.body.style.userSelect = "none"; // Chống bôi đen text khi kéo
        };

        // 2. Khi di chuyển chuột/vuốt tay
        const onDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const currentX =
                e.pageX || (e.touches ? e.touches[0].pageX : startX);
            const deltaX = currentX - startX; // Khoảng cách đã kéo

            // Tính toán tỷ lệ: Di chuyển thumb 1px thì scroll container bao nhiêu px
            const trackMovableWidth =
                track.clientWidth - scrollThumb.clientWidth;
            const containerScrollableWidth =
                scrollContainer.scrollWidth - scrollContainer.clientWidth;

            const moveRatio = deltaX / trackMovableWidth;
            const scrollAmount = moveRatio * containerScrollableWidth;

            // Cập nhật vị trí cuộn của container (sự kiện 'scroll' ở mục A sẽ tự động chạy để dời vị trí thumb)
            scrollContainer.scrollLeft = scrollLeftStart + scrollAmount;
        };

        // 3. Khi nhả chuột/rời tay
        const stopDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            // Bật lại transition cho mượt
            scrollThumb.classList.add("transition-all", "duration-75");
            document.body.style.userSelect = "";
        };

        // Gắn sự kiện cho Chuột
        scrollThumb.addEventListener("mousedown", startDrag);
        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", stopDrag);

        // Gắn sự kiện cho Màn hình cảm ứng (Touch)
        scrollThumb.addEventListener("touchstart", startDrag);
        document.addEventListener("touchmove", onDrag, { passive: false });
        document.addEventListener("touchend", stopDrag);
    }
});
