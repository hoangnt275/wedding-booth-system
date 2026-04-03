const buttonGenCode = document.querySelector("[btn-gen-code]");
const codeDisplay = document.querySelector("[code-display]");
const finishCode = document.querySelector("[finish-code]");
const paperSize = document.querySelector("[paper-size]");
const paymentType = document.querySelector("[payment-type]");
const noteInput = document.querySelector('input[name="note"]');
const noteValue = noteInput ? noteInput.value : "";
let code;
buttonGenCode.addEventListener("click", () => {
    function generateCode(length = 5) {
        return Math.floor(100000 + Math.random() * 9000000000)
            .toString()
            .substring(0, length);
    }
    code = generateCode(5);
    //console.log(code);
    codeDisplay.value = code;
    buttonGenCode.disabled = true;
});
finishCode.addEventListener("click", async () => {
    try {
        const res = await fetch("/admin/payment/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: code,
                paperSize: paperSize.innerText,
                paymentType: paymentType.innerText,
                note: noteValue,
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            alert("Lỗi khi tạo mã: " + error.error);
            return;
        }

        const data = await res.json();
        alert(data.message); // "Tạo thành công"
        location.href = "/admin/payment"; // ✅ chuyển trang sau khi thành công
    } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra khi gửi yêu cầu!");
    }
});
