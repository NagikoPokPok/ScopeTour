document.querySelector(".btn-login").addEventListener("click", async () => {
    const email = document.querySelector("#edt_email").value;
    const password = document.querySelector("#edt_password").value;

    if (!email || !password) {
        alert("Vui lòng nhập email và mật khẩu!");
        return;
    }
    
    const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    console.log("📩 Dữ liệu gửi đi:", { email, password }); // Kiểm tra email có bị undefined không?

    // Kiểm tra lỗi HTTP
    if (!response.ok) {
        alert("Lỗi đăng nhập! Kiểm tra email/mật khẩu.");
        console.log(response);
        return;
    }
    
    
    const data = await response.json();
    
    
    if (data.success) {
        window.location.href = "list-goal-team.html";
    } else 
        alert(data.message);
});