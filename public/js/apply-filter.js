const buttons = document.querySelectorAll("button[data-filter]");
const editedPhotoImg = document.querySelector(".edited-photo img");
const { frameType, selectedFrame } = editedPhotoImg.dataset;
const finishButton = document.querySelector(".btn-finish");
import Loading from "../helper/loading.js";
buttons.forEach((button) => {
    button.addEventListener("click", async () => {
        const filterName = button.dataset.filter;
        
        console.log(frameType);
        console.log(filterName);

        try {
            // 👉 BẬT LOADING
            Loading.show();

            const res = await fetch(
                `/edit-${frameType}?filterName=${filterName}`,
                {
                    method: "POST",
                }
            );

            const data = await res.json();

            if (!data.success) {
                alert("Lỗi áp filter");
                return;
            }

            // update ảnh ngay, KHÔNG reload page
            editedPhotoImg.src = `images/${data.finalPhoto}`;

            // đợi ảnh load xong mới tắt loading (mượt hơn)
            editedPhotoImg.onload = () => {
                Loading.hide();
            };

        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra");
            Loading.hide();
        }
    });
});

finishButton.addEventListener("click", async () => {
    try {
        window.location = "/apply-sticker";
    } catch (err) {
        console.error(err);
        alert("Lỗi chuyển trang");
    }
});
