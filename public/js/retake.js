const retakeButton = document.querySelector("[retake-button]");
const noButton = document.querySelector("[no-button]");

const frameType = document.querySelector("#preview").getAttribute("frameType");
// Trích xuất dữ liệu từ data-attribute
const appContainer = document.getElementById("app-container");

// Chuyển đổi string sang number vì data-attribute luôn lưu dạng chuỗi
const photoCount = parseInt(appContainer.dataset.photoCount, 10);// Nút chụp lại
if (retakeButton) {
    retakeButton.addEventListener("click", async () => {
        try {
            const res = await fetch("/retake", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Server error");

            location.href = `/shoot`;
        } catch (err) {
            alert("Không thể chụp lại, vui lòng thử lại");
            console.error(err);
        }
    });
}

// Nút lưu ảnh
noButton.addEventListener("click", async () => {
    try {
        // // 1️⃣ Báo backend chuẩn bị filter (KHÔNG await)
        // fetch("/api/prepare-filters", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        // });

        // 2️⃣ Đếm ảnh (await để quyết định flow)
        const res = await fetch("/api/countImage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        console.log("Image count:", data.count);

        // 3️⃣ Đủ ảnh → chỉ MERGE original
        if (data.count >= photoCount) {
            const res2 = await fetch(`/edit?filterName=original`, {
                method: "POST",
            });
            const data2 = await res2.json();

            if (data2.success) {
                window.location.href = `/edit?finalPhoto=${data2.finalPhoto}`;
            }
        } else {
            location.href = `/shoot`;
        }
    } catch (err) {
        console.error(err);
    }
});
