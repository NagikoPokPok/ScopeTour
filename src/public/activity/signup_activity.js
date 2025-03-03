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