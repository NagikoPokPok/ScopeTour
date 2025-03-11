document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const token = urlParams.get("token");
    const team_id = urlParams.get("team_id");

    if (email) {
        document.getElementById("edt_email").value = email;
    }
    document.querySelector(".btn-login").addEventListener("click", async (event) => {
        event.preventDefault(); // Ngăn chặn gửi form nếu có lỗi
    
        const emailInput = document.querySelector("#edt_email");
        const email = emailInput.value.trim();
        const passwordInput = document.querySelector("#edt_password");
        const password = passwordInput.value;
    
        let isValid = true;
    
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
        if (!password) {
            passwordError.textContent = "Mật khẩu không được để trống!";
            passwordError.style.display = "block";
            isValid = false;
        } else if (password.length < 6) {
            passwordError.textContent = "Mật khẩu phải có ít nhất 6 ký tự!";
            passwordError.style.display = "block";
            isValid = false;
        }
    
        // Ngăn gửi request nếu có lỗi
        if (!isValid) {
            return;
        }
    
        console.log("📩 Dữ liệu gửi đi:", { email, password }); // Kiểm tra email có bị undefined không?
    
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
    
            // Kiểm tra lỗi HTTP
            if (!response.ok) {
                alert(data.message);
                console.log(response);
                return;
            }
    
            
    
            if (data.success) {
                // Store user data including ID
                localStorage.setItem('userId', data.user.user_id.toString()); // Đảm bảo lưu dạng string
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userName', data.user.name);
                
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
            console.error("Lỗi:", error);
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


const gg_login = document.getElementById("gg-login");
gg_login.addEventListener("click", function() {
    // google.accounts.id.initialize({
    //     client_id: "381526760417-h5iji61k3hk1o22fgntmrfp771q98cg6.apps.googleusercontent.com",
    //     callback: handleCredentialResponse
    // });

    // google.accounts.id.prompt(); // Hiển thị hộp thoại đăng nhập Google
});

async function handleCredentialResponse(response) {
    console.log("Google OAuth Response:", response);

    if (response.credential) {
        try {
            // Gửi token Google đến backend để xác thực
            const res = await fetch("http://localhost:3000/api/login/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: response.credential })
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Đăng nhập Google thất bại: " + data.message);
                return;
            }

            // Lưu thông tin user vào localStorage
            localStorage.setItem("userId", data.user.user_id);
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userName", data.user.name);

            alert("Đăng nhập Google thành công!");

            // Nếu có lời mời tham gia nhóm, thực hiện join
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");
            const team_id = urlParams.get("team_id");

            if (token && team_id) {
                await completeJoin(data.user.email, token, team_id);
            } else {
                window.location.href = "list-goal-team.html"; // Chuyển hướng sau khi đăng nhập
            }
        } catch (error) {
            alert("Lỗi kết nối máy chủ!");
            console.error("Lỗi:", error);
        }
    } else {
        alert("Đăng nhập Google thất bại!");
    }
}