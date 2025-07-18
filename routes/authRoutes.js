const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

const {  signup,  verifyEmailOtp,  login,  resendOtp,  logout} = require("../controllers/authController");

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

module.exports = router;
