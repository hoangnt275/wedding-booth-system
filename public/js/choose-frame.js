const frameItems = document.querySelectorAll(".frame-item");
const url = new URL(window.location);
const btnFinish = document.querySelector("[btn-finish]");
let frameName = null;
console.log(url);
frameItems.forEach((item) => {
    item.addEventListener("click", () => {
        frameName = item.dataset.frame;
        frameItems.forEach((i) => {
            i.classList.remove("active");
        });
        item.classList.add("active");
    });
});
btnFinish.addEventListener("click", async () => {
    if (!frameName) {
        alert("Vui lòng chọn khung ảnh trước khi hoàn thành.");
        return;
    }
    const res = await fetch("/chooseFrame", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ frame: frameName }),
        credentials: "same-origin",
    });
    const data = await res.json();

    if (data.success) {
        // 👉 Chuyển sang màn hình chụp
        window.location.href = `/shoot?frameType=${data.frameType}`;
    } else {
        alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
});
