function addCharacterCounter(inputId, counterId) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);

    if (!input || !counter) return; // Kiểm tra nếu phần tử không tồn tại

    input.addEventListener("input", function () {
        counter.textContent = `${input.value.length}/${input.maxLength} characters`;
    });
}