document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".modal").forEach(modal => {
        // Khi mở modal, đảm bảo chỉ có 1 backdrop duy nhất
        modal.addEventListener("show.bs.modal", function () {
            // Xóa tất cả backdrop trước khi Bootstrap tạo backdrop mới
            document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());

            // Kiểm tra nếu không có modal nào đang mở, thêm backdrop mới
            if (!document.querySelector(".modal.show")) {
                let backdrop = document.createElement("div");
                backdrop.className = "modal-backdrop fade show";
                document.body.appendChild(backdrop);
            }
        });

        // Khi đóng modal, xóa backdrop nếu không còn modal nào mở
        modal.addEventListener("hidden.bs.modal", function () {
            if (!document.querySelector(".modal.show")) {
                document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
                document.body.classList.remove("modal-open"); // Gỡ class làm mờ nền
            }
        });
    });
});
