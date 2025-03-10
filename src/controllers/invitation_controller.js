const UserService = require("../services/user_service");
const sendInvitationEmail = require("../services/email_service");
const crypto = require("crypto"); // 🔥 Thêm để tạo token bảo mật

class InvitationController {
    static async sendInvitation(req, res) {
        console.log("📩 API /api/sendInvitation được gọi");
        console.log(req.body);
        const { emails } = req.body;

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ success: false , message: "Email is required" });
        }
        
        try {
            let oldUser = [];
            let newUser = [];
            let inviteLinkForNewUser = `http://localhost:5500/src/views/login.html`;
            let inviteLinkForOldUser = [];

            for (const email of emails) {
                // 📌 Kiểm tra xem email có tồn tại trong hệ thống không
                const user = await UserService.getUserByEmail(email);
                
                if (user) {
                    const token = crypto.randomBytes(32).toString("hex");
                    await UserService.saveInviteToken(email, token);
                    let inviteLink = `http://localhost:5500/join?email=${encodeURIComponent(email)}&token=${token}`;
                    inviteLinkForOldUser.push(inviteLink);
                    oldUser.push(email);
                } else
                    newUser.push(email);
                
            }

            // 📩 Gửi email
            if(newUser.length > 0){
                try {
                    await sendInvitationEmail(newUser, inviteLinkForNewUser);
                    console.log("Invitation sent successfully for new user");
                } catch (error) {
                    console.log("Invitation sent fail for new user");
                }
            }
            if(oldUser.length > 0){
                countOldUser = oldUser.length;
                for(let i =0; i < countOldUser; i++){
                    try {
                        await sendInvitationEmail(oldUser[i], inviteLinkForOldUser[i]);
                        console.log("Invitation sent successfully for " + oldUser[i]);
                    } catch (error) {
                        console.log("Invitation sent fail for " + oldUser[i]);
                    }
                }
            }
            res.json({ success: true, message: "Invitation sent successfully" });
        } catch (error) {
            console.error("Error sending invitation:", error);
            res.status(500).json({ success: false , message: "Failed to send invitation" });
        }
    }
}

module.exports = InvitationController;
