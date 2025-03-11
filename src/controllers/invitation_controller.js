const UserService = require("../services/user_service");
const sendInvitationEmail = require("../services/email_service");
const crypto = require("crypto"); // 🔥 Thêm để tạo token bảo mật

class InvitationController {
    // static async sendInvitation(req, res) {
    //     console.log("📩 API /api/sendInvitation được gọi");
    //     console.log(req.body);
    //     const { emails } = req.body;

    //     if (!emails || !Array.isArray(emails) || emails.length === 0) {
    //         return res.status(400).json({ success: false , message: "Email is required" });
    //     }
        
    //     try {
    //         let oldUser = [];
    //         let newUser = [];
    //         let inviteLinkForNewUser = `http://localhost:5500/src/views/login.html`;
    //         let inviteLinkForOldUser = [];

    //         for (const email of emails) {
    //             // 📌 Kiểm tra xem email có tồn tại trong hệ thống không
    //             const user = await UserService.getUserByEmail(email);
                
    //             if (user) {
    //                 const token = crypto.randomBytes(32).toString("hex");
    //                 await UserService.saveInviteToken(email, token);
    //                 let inviteLink = `http://localhost:5500/join?email=${encodeURIComponent(email)}&token=${token}`;
    //                 inviteLinkForOldUser.push(inviteLink);
    //                 oldUser.push(email);
    //             } else
    //                 newUser.push(email);
                
    //         }

    //         // 📩 Gửi email
    //         if(newUser.length > 0){
    //             try {
    //                 await sendInvitationEmail(newUser, inviteLinkForNewUser);
    //                 console.log("Invitation sent successfully for new user");
    //             } catch (error) {
    //                 console.log("Invitation sent fail for new user");
    //             }
    //         }
    //         if(oldUser.length > 0){
    //             countOldUser = oldUser.length;
    //             for(let i =0; i < countOldUser; i++){
    //                 try {
    //                     await sendInvitationEmail(oldUser[i], inviteLinkForOldUser[i]);
    //                     console.log("Invitation sent successfully for " + oldUser[i]);
    //                 } catch (error) {
    //                     console.log("Invitation sent fail for " + oldUser[i]);
    //                 }
    //             }
    //         }
    //         res.json({ success: true, message: "Invitation sent successfully" });
    //     } catch (error) {
    //         console.error("Error sending invitation:", error);
    //         res.status(500).json({ success: false , message: "Failed to send invitation" });
    //     }
    // }

    static async joinGroup(req, res) {
        console.log("📩 API /api/joinGroup called");
        const { email, token } = req.query;
        console.log("JoinGroup: "+req.query)
        if (!email || !token) {
            return res.status(400).json({ success: false, message: "Email and token are required" });
        }

        try {
            // 📌 Kiểm tra token có hợp lệ không
            const isValid = await UserService.verifyInviteToken(email, token);

            if (!isValid) {
                return res.status(400).json({ success: false, message: "Invalid or expired token" });
            }

            // 📌 Kiểm tra xem người dùng đã có tài khoản chưa
            const user = await UserService.getUserByEmail(email);
            if (!user) {
                // Người dùng mới → Chuyển đến trang đăng ký
                return res.redirect(`/src/views/signup.html?email=${encodeURIComponent(email)}&token=${token}`);
            } else {
                // Người dùng cũ → Chuyển đến trang đăng nhập
                return res.redirect(`/src/views/login.html?email=${encodeURIComponent(email)}&token=${token}`);
            }
        } catch (error) {
            console.error("Error joining group:", error);
            res.status(500).json({ success: false, message: "Failed to join group" });
        }
    }

    static async completeJoin(req, res) {
        try {
            const { email, token, team_id } = req.body;
    
            if (!email || !token || !team_id) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email, token and team_id are required' 
                });
            }
    
            // Verify invitation token
            const isValid = await UserService.verifyInviteToken(email, token);
            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired invitation'
                });
            }
    
            // Get user info
            const user = await UserService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
    
            // Add user to team
            await UserService.addUserToTeam(user.user_id, team_id);
    
            // Delete used invitation token
            await UserService.deleteInviteToken(email);
    
            return res.status(200).json({
                success: true,
                message: 'Successfully joined team'
            });
        } catch (error) {
            console.error('Error completing team join:', error);
            return res.status(500).json({
                success: false,
                message: 'Error joining team'
            });
        }
    }

    static async sendInvitation(req, res) {
        console.log("📩 API /api/sendInvitation được gọi");
        console.log(req.body);
        const { emails } = req.body;
        const team_id = 1;

        if (!emails || !Array.isArray(emails) || emails.length === 0 || !team_id) {
            return res.status(400).json({ success: false, message: "Emails and team_id are required" });
        }

        try {
            let newUserEmails = [];
            let oldUserEmails = [];

            for (const email of emails) {
                // 📌 Kiểm tra xem email đã có tài khoản chưa
                const user = await UserService.getUserByEmail(email);
                const token = crypto.randomBytes(32).toString("hex");

                // 📌 Lưu token vào database
                await UserService.saveInviteToken(email, token, team_id);

                let inviteLink = "";
                if (user) {
                    oldUserEmails.push({ email, inviteLink: `http://localhost:5500//src/views/signup.html?email=${encodeURIComponent(email)}&token=${token}&team_id=${team_id}` });
                } else {
                    newUserEmails.push({ email, inviteLink: `http://localhost:5500//src/views/signup.html?email=${encodeURIComponent(email)}&token=${token}&team_id=${team_id}` });
                }
            }

            // 📩 Gửi email cho người dùng mới (cần đăng ký)
            for (const { email, inviteLink } of newUserEmails) {
                try {
                    await sendInvitationEmail(email, inviteLink);
                    console.log(`📩 Invitation sent to new user: ${email}`);
                } catch (error) {
                    console.error(`❌ Failed to send invitation to new user: ${email}`, error);
                }
            }

            // 📩 Gửi email cho người dùng cũ (chỉ cần đăng nhập)
            for (const { email, inviteLink } of oldUserEmails) {
                try {
                    await sendInvitationEmail(email, inviteLink);
                    console.log(`📩 Invitation sent to existing user: ${email}`);
                } catch (error) {
                    console.error(`❌ Failed to send invitation to existing user: ${email}`, error);
                }
            }

            res.json({ success: true, message: "Invitations sent successfully" });
        } catch (error) {
            console.error("❌ Error sending invitations:", error);
            res.status(500).json({ success: false, message: "Failed to send invitations" });
        }
    }
}

module.exports = InvitationController;
