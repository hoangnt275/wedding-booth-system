const buttons = document.querySelectorAll("button[data-filter]");
const editedPhotoImg = document.querySelector(".edited-photo img");
const { frameType, selectedFrame } = editedPhotoImg.dataset;
console.log("ok");
buttons.forEach((button) => {
    button.addEventListener("click", async () => {
        const filterName = button.dataset.filter;
        console.log(filterName);
        const res = await fetch(`/apply-filter?filterName=${filterName}`, {
            method: "POST",
        });

        const data = await res.json();

        if (!data.success) {
            alert("Lỗi áp filter");
            return;
        }

        // update ảnh ngay, KHÔNG reload page (mượt hơn)
        editedPhotoImg.src = data.finalPhoto;
    });
});
