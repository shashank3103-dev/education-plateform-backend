const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

const {  signup,  verifyEmailOtp,  login,  resendOtp,saveFcmToken,  logout, googleAuthLogin} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/verifyEmail-otp", verifyEmailOtp);
router.post("/login", login);
router.post("/resend-otp", resendOtp);

router.post("/logout", authenticateToken, logout);

router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});
// routes/user.js
router.post('/save-fcm-token', authenticateToken, saveFcmToken);
router.post("/auth/google-login", googleAuthLogin);
module.exports = router;
