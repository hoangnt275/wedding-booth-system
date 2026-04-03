const stickerItem = document.querySelector("[sticker-item]");
const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.querySelector(".no-btn");
const finishBtn = document.querySelector(".btn-finish");
const finalPhoto = document.querySelector(".final-photo");
import Loading from "../helper/loading.js";
console.log(stickerItem);
if (stickerItem) {
    const stickerSrc = stickerItem.getAttribute("src");
    yesBtn.addEventListener("click", async () => {
        const stickerName = stickerSrc.split("/").pop();
        console.log(stickerName);
        const res = await fetch(`/apply-sticker?stickerName=${stickerName}`, {
            method: "POST",
        });
        const data = await res.json();
        if (!data) {
            alert("Lỗi áp sticker");
            return;
        }
        finalPhoto.src = data.finalPhoto;
    });
    noBtn.addEventListener("click", async () => {
        const res = await fetch(`/apply-sticker?stickerName=none`, {
            method: "POST",
        });
        const data = await res.json();
        if (!data) {
            alert("Lỗi áp sticker");
            return;
        }
        finalPhoto.src = data.finalPhoto;
    });
}

finishBtn.addEventListener("click", async () => {
    try {
            // 👉 BẬT LOADING
            Loading.show();

        await fetch("/api/uploadToR2", { method: "POST" });
          Loading.hide();
        window.location = "/printing";
    } catch (err) {
        console.error(err);
        alert("Upload thất bại");
          Loading.hide();
    }
});
