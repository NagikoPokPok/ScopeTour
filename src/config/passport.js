const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserService = require("../services/user_service");
const jwt = require("jsonwebtoken");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await UserService.getUserByEmail(email);

        if (!user) {
          // Nếu chưa có user, tạo mới
          user = await UserService.createUser(email, profile.displayName, null); // Không có password
        }

        // Tạo token đăng nhập
        const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
