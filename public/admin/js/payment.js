// admin/js/payment.js
const paymentRadioGroup = document.querySelectorAll(
    'input[name="paymentType"]',
);

const priceInput = document.querySelector("#price");
const paperSizeRadioGroup = document.querySelectorAll(
    'input[name="paperSize"]',
);
paperSizeRadioGroup.forEach((radio) => {
    radio.addEventListener("change", function () {
        const selectedRadio = document.querySelector(
            'input[name="paperSize"]:checked',
        );
        if (selectedRadio) {
            console.log(selectedRadio.value);
            if (selectedRadio.value === "SMALL") {
                priceInput.value = 70000;
            } else if (selectedRadio.value === "LARGE") {
                priceInput.value = 100000;
            }
        }
    });
});

// nhap so tien

const payInput = document.querySelector('[name="pay"]');
const backInput = document.querySelector('[name="back"]');
payInput.addEventListener("change", () => {
    backInput.value = payInput.value - priceInput.value;
});
