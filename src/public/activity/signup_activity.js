document.querySelector(".btn-sign-up").addEventListener("click", async () => {
    const userName = document.querySelector("#edt_name").value;
    const email = document.querySelector("#edt_email").value;
    const password = document.querySelector("#edt_password").value;
    const confirmPassword = document.querySelector("#edt_confirm_password").value;
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    
    const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password, confirmPassword })
    });
    
    const data = await response.json();
    

    if (data.success) {
        window.location.href = "login.html";
    } else 
        alert(data.message);
});
document.querySelector(".btn-send-otp").addEventListener("click", async () => {
    const email = document.querySelector("#edt_email").value;

    const response = await fetch("http://localhost:3000/api/signup/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    alert(data.message);
    document.querySelector(".otp-section").style.display = "block"; // Hiện ô nhập OTP
});

document.querySelector(".btn-verify-otp").addEventListener("click", async () => {
    const email = document.querySelector("#edt_email").value;
    const otp = document.querySelector("#edt_otp").value;

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
});