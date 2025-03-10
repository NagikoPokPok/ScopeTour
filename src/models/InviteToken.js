const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InviteToken = sequelize.define("InviteToken", {
    token_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    token: {
        type: DataTypes.STRING(64), // Mã token (mã hóa ngẫu nhiên)
        allowNull: false,
        unique: true
    },
    team_id: {
        type: DataTypes.INTEGER, // ID của team mà người dùng được mời vào
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE, // Thời gian hết hạn của token (ví dụ: sau 24h)
        allowNull: false
    }
}, {
    tableName: "invite_tokens",
    timestamps: false
});

// ✅ Đảm bảo một email chỉ có một lời mời hợp lệ cho mỗi team
InviteToken.addHook("beforeValidate", async (invite) => {
    const existingInvite = await InviteToken.findOne({
        where: { email: invite.email, team_id: invite.team_id }
    });

    if (existingInvite) {
        throw new Error("This email already has an active invitation for this team.");
    }
});

module.exports = InviteToken;
