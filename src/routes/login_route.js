const express = require("express");
const UserController = require("../controllers/user_controller");
const router = express.Router();

router.post("/", UserController.getUser);

// Đăng nhập bằng Google
router.get("/google", UserController.googleAuth);
router.get("/google/callback", UserController.googleAuthCallback);

module.exports = router;
