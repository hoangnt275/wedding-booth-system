// document.addEventListener("DOMContentLoaded", async () => {
//     try {
//         const res = await fetch(`/api/print`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//         });

//         const data = await res.json();
//         if (!data.success) {
//             throw new Error(data.message || "In ảnh thất bại");
//         }
//     } catch (err) {
//         alert(err.message);
//     }
// });
const btnFinish = document.querySelector(".btn-finish");
btnFinish.addEventListener("click", async () => {
    const res = await fetch(`/api/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.message || "In ảnh thất bại");
    }
    window.location.href = "/";
});
