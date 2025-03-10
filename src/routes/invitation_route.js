const express = require("express");
const InvitationController = require("../controllers/invitation_controller");

const router = express.Router();

// 📩 API gửi email mời
router.post("/", InvitationController.sendInvitation);

// 🚀 API xử lý khi user nhấn vào link mời
router.get("/joinGroup", InvitationController.joinGroup);

// 🚀 API hoàn tất đăng nhập/đăng ký và thêm vào nhóm
router.post("/completeJoin", InvitationController.completeJoin);

module.exports = router;
