document.addEventListener('DOMContentLoaded', function () {
    // Lắng nghe sự kiện click vào button
    document.getElementById('btn-create-team').addEventListener('click', function () {
        const emailList = Array.from(
            document.querySelectorAll('#sample1 .emails-input .email-chip:not(.invalid)')
        ).map(span => span.textContent.trim().slice(0,-1)); // Lấy nội dung của thẻ span, slice(0,-1): bỏ đi ký tự cuối cùng (kí tự x)

        console.log(emailList); // Hiển thị danh sách email hợp lệ trong console
    });
});
