document.addEventListener("DOMContentLoaded", function () {
    const sendBtn = document.getElementById("sendBtn");
    const emailInput = document.getElementById("emailInput");
    const messageElement = document.getElementById("message");

    sendBtn.addEventListener("click", function () {
        const email = emailInput.value.trim();
        var emails = [email, "huynhduchuy47@gmail.com", "vohungcuong@dtu.edu.vn"]

        if (!email) {
            messageElement.style.color = "red";
            messageElement.innerText = "Please enter an email.";
            return;
        }

        console.log("Email:", emails);

        fetch("http://localhost:3000/api/invitation", { // 🔥 Đảm bảo đường dẫn API đúng
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ emails })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) messageElement.style.color = "green";
            else messageElement.style.color = "red";
            messageElement.innerText = data.message || "Invitation sent successfully!";
        })
        .catch(error => {
            console.error("API Error:", error);
            messageElement.style.color = "red";
            messageElement.innerText = "Failed to send invitation.";
        });
    });
});
