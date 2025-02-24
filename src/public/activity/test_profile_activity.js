// document.addEventListener("DOMContentLoaded", async function () {
//     const imagePreview = document.getElementById("image_preview");
//     const nameInput = document.getElementById("name");
//     const emailInput = document.getElementById("email");
//     const profileForm = document.getElementById("profileForm");

//     try {
//         // Gọi API để lấy dữ liệu user từ backend
//         const response = await fetch("/api/user/profile");
//         const user = await response.json();

//         // Gán dữ liệu vào form
//         if (user.user_img) {
//             imagePreview.src = user.user_img;
//         }
//         nameInput.value = user.user_name || "";
//         emailInput.value = user.email || "";
//     } catch (error) {
//         console.error("Error fetching user data:", error);
//     }

//     // Xử lý cập nhật ảnh khi chọn file mới
//     document.getElementById("image").addEventListener("change", function (event) {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = function (e) {
//                 imagePreview.src = e.target.result;
//             };
//             reader.readAsDataURL(file);
//         }
//     });

//     // Xử lý lưu form
//     profileForm.addEventListener("submit", async function (event) {
//         event.preventDefault();

//         const formData = new FormData();
//         formData.append("name", nameInput.value);
//         formData.append("email", emailInput.value);
//         const imageFile = document.getElementById("image").files[0];
//         if (imageFile) {
//             formData.append("image", imageFile);
//         }

//         try {
//             const response = await fetch("/api/user/update", {
//                 method: "POST",
//                 body: formData
//             });
//             const result = await response.json();
//             if (result.success) {
//                 alert("Profile updated successfully!");
//             } else {
//                 alert("Error updating profile!");
//             }
//         } catch (error) {
//             console.error("Error updating profile:", error);
//         }
//     });
// });
// profile.js

  
//   // Gán các sự kiện sau khi DOM được tải xong
//   document.addEventListener("DOMContentLoaded", function () {
//     // Gán sự kiện cho input file nếu chưa có attribute onchange (có thể bỏ attribute inline trong HTML)
//     const imageInput = document.getElementById("image");
//     if (imageInput) {
//       imageInput.addEventListener("change", handleChange);
//     }
    
//     // Gán sự kiện cho các input text và email (nếu cần)
//     const textInputs = document.querySelectorAll("input[type='text'], input[type='email']");
//     textInputs.forEach(function (input) {
//       input.addEventListener("input", handleChange);
//     });
//   });

  function save(){
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value;
    const image = document.getElementById("image_preview");
    
    console.log(name);
    console.log(email);
    console.log(image);

    let profile = {
        email: email,
        name: name,
        image: image.getAttribute('src')
    }
    localStorage.setItem('profile', JSON.stringify(profile));
    alert("successful")
    
  }

  window.onload = function () {
    const user = JSON.parse(localStorage.getItem("loggedInUser")); // Lấy thông tin người dùng
    let profiles = JSON.parse(localStorage.getItem("profile")) || []; // Lấy danh sách hồ sơ từ localStorage

    // Kiểm tra xem user có trong danh sách profile không
    let userProfile = [profiles].find(profile => profile.email === user.username);

    if (!userProfile) {
        // Nếu không có, tạo hồ sơ mặc định
        userProfile = {
            email: user.username,
            name: "New User",
            image: "" // Không có ảnh mặc định
        };
        profiles.push(userProfile);
        localStorage.setItem("profile", JSON.stringify(profiles)); // Lưu lại
    }

    // Hiển thị dữ liệu lên giao diện
    document.getElementById("name").value = userProfile.name;
    document.getElementById("email").value = userProfile.email;

    if (userProfile.image) {
        document.getElementById("image_preview").src = userProfile.image;
    }

    console.log(userProfile.name);
    console.log(userProfile.email);
    console.log(userProfile.image);
    
};

  
  
