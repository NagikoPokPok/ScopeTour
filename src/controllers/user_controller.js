const UserService = require("../services/user_service");
// const passport = require("passport");
const { sendOTPEmail, generateOTP } = require("../services/email_service");

class UserController {
    // API lấy thông tin người dùng
    static async getUser(req, res) {
        console.log("Dữ liệu nhận được:", req.body);
        const { userId, email, password } = req.body;
        console.log("Userid:", userId);
        if(!userId && !email){
            return res.status(404).json({ success: false, message: "Chưa có dữ liệu đua vào!" });
        }
        try {
            let user = null;

            if (userId) {
                user = await UserService.getUserById(userId);
            } else if (email && password) {
                const result = await UserService.getUserByAccount(email, password);

                // Nếu có lỗi, trả lỗi về frontend
                if (!result.success) {
                    return res.status(result.status).json({ success: false, message: result.message });
                }

                user = result.user; // Nếu thành công, lấy user
            }
            
            if (!user) {
                return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
            }
            // console.log(user);
            res.json({ 
                success: true, 
                user: {
                    user_id: user.user_id,
                    email: user.email,
                    name: user.user_name,
                    phone: user.phone_number,
                    image: user.user_img
                }
            });
            // console.log(response.);
        } catch (error) {
            res.status(500).json({ success: false, message: "Lỗi server!" });
        }
    }

    // API cập nhật mật khẩu
    static async changePassword(req, res) {
        try {
            const { userId, newPassword } = req.body;
            const success = await UserService.updatePassword(userId, newPassword);

            if (success) {
                res.json({ success: true, message: "Mật khẩu đã thay đổi thành công!" });
            } else {
                res.status(400).json({ success: false, message: "Không thể cập nhật mật khẩu!" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Lỗi server!" });
        }
    }

    //API tạo người dùng mới
    static async createUser(req, res){
        try {
            console.log("Dữ liệu nhận được:", req.body);
            const {userName, email, password, confirmPassword} = req.body;
            console.log('pass: ' + password + ", conf: " + confirmPassword + ", name: " + userName);
            if(password !== confirmPassword){
                res.status(400).json({ success: false, message: "Mật khẩu xác nhận không đúng!" });
            }else {
                const isExist = await UserService.getUserByEmail(email);

                if(!isExist){
                    const user = await UserService.createUser(email, userName, password);
                    if(user){
                        res.json({
                            success: true, 
                            user: {
                                user_id: user.user_id,
                                email: user.email,
                                name: user.user_name,
                                phone: user.phone_number
                            },
                            message: "Đã đăng kí thành công"});
                    } else {
                        res.status(400).json({ success: false, message: "Không thể đăng kí hồ sơ!" });
                    }
                } else {
                    res.status(400).json({ isExist: false, message: "Tài khoản đã tồn tại!" });
                }
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Lỗi server!" });
        }
    }

    //API cập nhật thông tin cá nhân
    static async updateProfile(req, res){
        
        try {
            const { userId, userName, image} = req.body;
            // if(image) image="kha986sa";
            
            const user = await UserService.updateProfile(userId, userName, image);
            
            if(user){
                console.log("hello1");
                res.json({
                    success: true, 
                    user: {
                        user_id: user.user_id,
                        email: user.email,
                        name: user.user_name,
                        // phone: user.phone_number,
                        image: user.user_img
                    },
                    message: "Đã cập nhật hồ sơ thành công"});
                    console.log("hello2");
            } else {
                res.status(400).json({ success: false, message: "Không thể cập nhật hồ sơ!" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Lỗi server!" });
        }
    }

    //Login with google
    // static googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

    // static googleAuthCallback = (req, res) => {
    //     passport.authenticate("google", { session: false }, (err, data) => {
    //     if (err || !data.user) {
    //         return res.status(401).json({ message: "Google authentication failed" });
    //     }
    //     res.json({ message: "Login successful", user: data.user, token: data.token });
    //     })(req, res);
    // };


    // Gửi OTP
    static async sendOTP(req, res) {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const otp = generateOTP();
        await UserService.saveOTP(email, otp);
        await sendOTPEmail(email, otp);

        res.json({ success: true, message: "OTP sent successfully" });
    }

    // Xác thực OTP
    static async verifyOTP(req, res) {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

        const isValid = await UserService.verifyOTP(email, otp);
        if (!isValid) return res.status(400).json({ error: "Invalid or expired OTP" });

        res.json({ success: true, message: "OTP verified successfully" });
    }
}

module.exports = UserController;
