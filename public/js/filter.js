import Loading from "../helper/loading.js";

document.addEventListener("DOMContentLoaded", () => {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const finishBtn = document.getElementById("btn-finish");
    let currentFilter = "original"; // Khớp với filter mặc định ở trên Pug
    const editedPhotoImg = document.getElementById("preview-image");
    // Hiệu ứng click chọn Filter
    filterBtns.forEach((btn) => {
        btn.addEventListener("click", async () => {
            if (currentFilter === btn.dataset.filter) return; // Không làm gì nếu click lại nút đang chọn

            currentFilter = btn.dataset.filter;

            // 1. Reset toàn bộ nút về trạng thái CHƯA CHỌN (Trong suốt, viền mỏng)
            filterBtns.forEach((b) => {
                b.className =
                    "filter-btn px-12 py-3 rounded-[50px] bg-transparent text-main border border-main text-[3rem] font-pinyon hover:bg-gray-200 transition-all duration-300";
            });

            // 2. Highlight nút ĐƯỢC CHỌN (Nền đen bg-main, viền sáng, scale nhẹ)
            btn.className =
                "filter-btn px-12 py-3 rounded-[50px] bg-main text-white text-[3rem] font-pinyon transition-all duration-300 ring-4 ring-main ring-opacity-50 scale-105";

            // 👉 BẬT LOADING
            if (typeof Loading !== "undefined") Loading.show();

            try {
                const res = await fetch(`/edit/?filterName=${currentFilter}`, {
                    method: "POST",
                });

                const data = await res.json();

                if (!data.success) {
                    alert("Lỗi áp filter");
                    if (typeof Loading !== "undefined") Loading.hide();
                    return;
                }

                // Update ảnh ngay lập tức
                editedPhotoImg.src = data.mergedPhotoUrl;
                console.log("Đã chọn filter:", currentFilter);

                // Đợi ảnh load xong mới tắt loading cho mượt
                editedPhotoImg.onload = () => {
                    if (typeof Loading !== "undefined") Loading.hide();
                };
            } catch (error) {
                console.error(error);
                alert("Mất kết nối server!");
                if (typeof Loading !== "undefined") Loading.hide();
            }
        });
    });

    // Nút Tiếp tục
    finishBtn.addEventListener("click", async () => {
        try {
            // Khóa nút để tránh click nhiều lần
            finishBtn.classList.add("opacity-50", "pointer-events-none");
            finishBtn.innerText = "Đang xử lý...";

            window.location.href = `/select-printing?finalPhoto=final_${currentFilter}`;
        } catch (err) {
            console.error(err);
            alert("Chuyển trang thất bại");
            finishBtn.classList.remove("opacity-50", "pointer-events-none");
            finishBtn.innerText = "Tiếp tục";
        }
    });
});
