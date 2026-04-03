console.log("ok");
const qs = new URLSearchParams(window.location.search);
const mode = (qs.get("mode") || "4x6").toLowerCase();
console.log(mode);

const buttonPrint = document.querySelector("[btn-print]");
buttonPrint.addEventListener("click", async () => {
    try {
        const res = await fetch(
            `/api/test-print?mode=${encodeURIComponent(mode)}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            },
        );

        const data = await res.json();
        if (!data.success) {
            throw new Error(data.message || "In ảnh thất bại");
        }
    } catch (err) {
        alert(err.message);
    }
});
