const UserService = require("../services/userService");

class UserController {
    // API lấy thông tin người dùng
    static async getUser(req, res) {
        try {
            const user = await UserService.getUserByEmail(req.params.email);
            if (!user) {
                return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
            }
            res.json({ success: true, user });
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

    //API cập nhật thông tin cá nhân
}

module.exports = UserController;
