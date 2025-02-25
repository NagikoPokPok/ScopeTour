

function triggerFileInput() {
    document.getElementById("image").click();
}

function handleChange(event) {
    const file = event.target.files[0];
    if (file) {
        alert("Bạn đã chọn: " + file.name);
        // Hoặc hiển thị ảnh vừa chọn
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector(".profile-image img").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}