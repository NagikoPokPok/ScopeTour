const nodemailer = require("nodemailer");

const sendInvitationEmail = async (recipientEmail, inviteLink) => {
    try {
        console.log('send email');
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "cuong2432004@gmail.com", // Thay bằng email của bạn
                pass: "qzqc vrwm czub unbr", // Thay bằng mật khẩu ứng dụng của bạn
            },
        });

        let mailOptions = {
            from: '"Your Website" <cuong2432004@gmail.com>',
            to: recipientEmail,
            subject: "You're Invited to Join Our Group on Scope Tour! 🚀",
            html: `
                <h2>Hi there!</h2>
                <p>You have been invited to join our group on <strong>Scope Tour</strong> – the ultimate platform for planning and sharing amazing trips.</p>
                <p>By joining the group, you can:</p>
                <ul>
                    <li>Plan your travels efficiently with your team.</li>
                    <li>Share locations, itineraries, and experiences.</li>
                    <li>Connect with friends and explore new adventures together.</li>
                </ul>
                <p>Click the button below to accept the invitation and start your journey:</p>
                <a href="${inviteLink}" style="display:inline-block; padding:12px 24px; color:white; background-color:#007BFF; text-decoration:none; border-radius:5px; font-weight:bold;">
                    Join Now
                </a>
                <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
                <p><a href="${inviteLink}">${inviteLink}</a></p>
                <br>
                <p>See you in the group! 🚀</p>
                <p><strong>Scope Tour Team</strong></p>
            `,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendInvitationEmail;
