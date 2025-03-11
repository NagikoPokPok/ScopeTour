document.addEventListener("DOMContentLoaded", async () => {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const imageInput = document.getElementById("image");
    const profileImage = document.querySelector(".profile-image img");

    try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            console.error("Không tìm thấy userId trong localStorage!");
            return;
        }

        const response = await fetch("http://localhost:3000/api/user-profile/load", {
            method: "POST",  
            // credentials: "include",  
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId })
        });

        const data = await response.json();

        // Kiểm tra lỗi HTTP
        if (!response.ok) {
            alert(data.message || "Không thể tải hồ sơ!");
            console.error("Lỗi server:", data);
            return;
        }

        if (data.success) {
            // Gán dữ liệu vào giao diện với biến đúng
            // const user = JSON.parse(data.user);
            nameInput.value = data.user.name ? data.user.name : "";
            emailInput.value = data.user.email;
            phoneInput.value = data.user.phone_number ? data.user.phone_number : "";

            if (data.user.image) {
                console.log(data.user.image)
                // profileImage.src = data.user.image;
            }
            let userImage;
            try {
                userImage = JSON.parse(localStorage.getItem("userImage"));
                profileImage.src = userImage;
            } catch (error) {
                
            }
            // console.log(JSON.parse(data.user.image));

            console.log("Hồ sơ người dùng đã tải thành công:", data.user);
        } else {
            alert("Lỗi khi tải hồ sơ: " + data.message);
        }

    } catch (error) {
        alert("Lỗi kết nối máy chủ!");
        console.error("Lỗi khi tải hồ sơ:", error);
    }

    // Xử lý cập nhật hồ sơ
    document.getElementById("changeButton").addEventListener("click", () => {
        const formData = new FormData();
        formData.append("user_name", nameInput.value);
        formData.append("email", emailInput.value);
        formData.append("phone_number", phoneInput.value);
        if (imageInput.files[0]) {
            formData.append("image", imageInput.files[0]);
        }
        const userId = localStorage.getItem("userId");
        // console.log("src: " + profileImage.getAttribute('src'));

        fetch("http://localhost:3000/api/user-profile/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId, userName: nameInput.value, image:  profileImage.getAttribute('src')})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Cập nhật thành công!");
                localStorage.setItem('userImage', JSON.stringify(profileImage.getAttribute('src')));
                location.reload();
            } else {
                alert("Lỗi cập nhật: " + data.message);
            }
        })
        .catch(error => console.error("Lỗi cập nhật hồ sơ:", error));
    });
});
function triggerFileInput() {
    document.getElementById("image").click();
}

function handleChange(event) {
    const file = event.target.files[0];
    if (file) {
        // alert("Bạn đã chọn: " + file.name);
        // Hoặc hiển thị ảnh vừa chọn
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector(".profile-image img").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
