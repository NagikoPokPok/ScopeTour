document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const token = urlParams.get("token");
    const team_id = urlParams.get("team_id");

    if (email) {
        document.getElementById("edt_email").value = email;
    }
    document.querySelector(".btn-sign-up").addEventListener("click", async (event) => {
        event.preventDefault(); // Ngăn chặn gửi form nếu có lỗi
    
        const userName = document.querySelector("#edt_name").value.trim();
        const emailInput = document.querySelector("#edt_email");
        const email = emailInput.value.trim();
        const passwordInput = document.querySelector("#edt_password");
        const password = passwordInput.value.trim();
        const confirmPasswordInput = document.querySelector("#edt_confirm_password");
        const confirmPassword = confirmPasswordInput.value;
    
        let isValid = true;

        // // Kiểm tra username
        // let usernameError = document.getElementById("username_error");
        // if (!userName) {
        //     usernameError.textContent = "Tên người dùng không được để trống!";
        //     usernameError.style.display = "block";
        //     isValid = false;
        // } else {
        //     usernameError.style.display = "none";
        // }
    
        // Ẩn tất cả lỗi trước khi kiểm tra
        document.querySelectorAll(".error").forEach(error => {
            error.style.display = "none";
        });
    
        // Kiểm tra email
        let emailError = document.getElementById("email_error");
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            emailError.textContent = "Email không được để trống!";
            emailError.style.display = "block";
            isValid = false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = "Email không hợp lệ!";
            emailError.style.display = "block";
            isValid = false;
        }
    
        // Kiểm tra password
        let passwordError = document.getElementById("password_error");
        if (password.length < 6) {
            passwordError.textContent = "Mật khẩu phải có ít nhất 6 ký tự!";
            passwordError.style.display = "block";
            isValid = false;
        }
    
        // Kiểm tra xác nhận password
        let confirmPasswordError = document.getElementById("confirm_password_error");
        if (confirmPassword !== password) {
            confirmPasswordError.textContent = "Mật khẩu xác nhận không khớp!";
            confirmPasswordError.style.display = "block";
            isValid = false;
        }
    
        // Ngăn gửi dữ liệu nếu có lỗi
        if (!isValid) {
            return;
        }
    
        // Gửi dữ liệu nếu hợp lệ
        try {
            const response = await fetch("http://localhost:3000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, email, password, confirmPassword })
            });
    
            const data = await response.json();
    
            if (data.success) {
                if (token && team_id) {
                    await completeJoin(email, token, team_id);
                } else {
                    window.location.href = "list-goal-team.html";
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Lỗi kết nối máy chủ!");
        }
    });
    
    // Gửi OTP
    document.querySelector(".btn-send-otp").addEventListener("click", async () => {
        const email = document.querySelector("#edt_email").value.trim();
    
        try {
            const response = await fetch("http://localhost:3000/api/signup/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
    
            const data = await response.json();
            alert(data.message);
            document.querySelector(".otp-section").style.display = "block"; // Hiện ô nhập OTP
        } catch (error) {
            alert("Lỗi gửi OTP!");
        }
    });
    
    // Xác minh OTP
    document.querySelector(".btn-verify-otp").addEventListener("click", async () => {
        const email = document.querySelector("#edt_email").value.trim();
        const otp = document.querySelector("#edt_otp").value.trim();
    
        try {
            const response = await fetch("http://localhost:3000/api/signup/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });
    
            const data = await response.json();
            if (data.success) {
                alert("OTP verified! Proceed with registration.");
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Lỗi xác minh OTP!");
        }
    });
});

// 📌 Gửi yêu cầu tham gia nhóm sau khi đăng nhập thành công
async function completeJoin(email, token, team_id) {
    try {
        const response = await fetch("http://localhost:3000/api/invitation/completeJoin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token, team_id })
        });

        const data = await response.json();
        if (data.success) {
            window.location.href = data.redirectUrl; // Chuyển hướng đến giao diện nhóm
            // window.location.href = `/team-dashboard?team_id=${team_id}`;
        } else {
            alert("Failed to join team: " + data.message);
        }
    } catch (error) {
        alert("Lỗi tham gia nhóm!");
        console.error(error);
    }
}
