const filterBtns = document.querySelectorAll(".filter-btn");
const frameItems = document.querySelectorAll(".frame-item");
let selectedFrames = new Set();
/* ------------------------------
   1. Đổi filter
------------------------------ */
filterBtns.forEach((btn) => {
    if (!btn.dataset.filter) return;

    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        window.location.href = `?filter=${filter}`;
    });
});

/* ------------------------------
   2. Chọn nhiều frame để xoá
------------------------------ */
frameItems.forEach((item) => {
    item.addEventListener("click", () => {
        const path = item.dataset.src;

        if (item.classList.contains("selected")) {
            // Bỏ chọn
            item.classList.remove("selected");
            selectedFrames.delete(path);
        } else {
            // Chọn thêm
            item.classList.add("selected");
            selectedFrames.add(path);
        }

        console.log("Đã chọn:", Array.from(selectedFrames));
    });
});

/* ------------------------------
   3. Xoá nhiều frame
------------------------------ */
const delBtn = document.getElementById("delete-frame-btn");

delBtn.addEventListener("click", async () => {
    if (selectedFrames.size === 0) {
        alert("Hãy chọn ít nhất 1 khung để xoá!");
        return;
    }

    if (!confirm(`Xoá ${selectedFrames.size} khung đã chọn?`)) return;

    const res = await fetch("/admin/addFrames/delete-multiple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: Array.from(selectedFrames) }),
    });

    const data = await res.json();
    if (data.success) {
        window.location.reload();
    } else {
        alert("Xoá thất bại!");
    }
});
