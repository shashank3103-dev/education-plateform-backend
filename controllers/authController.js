const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const {
  User,
  Course,
  Order,
  OTP,
  OrderItem,
  RevokedToken,
} = require("../models");

const { generateAndSendOtp } = require("../utils/otpUtils");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!["student", "tutor", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      student: role === "student",
      tutor: role === "tutor",
      admin: role === "admin",
      is_verified: false,
      is_blocked: false,
    });

    // Generate and send OTP
    await generateAndSendOtp(email);

    return res.status(201).json({
      message: "User registered. OTP sent to email.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      error: error.message || "Registration failed",
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate and send OTP
    await generateAndSendOtp(email, "resend");

    return res.status(200).json({ message: "New OTP sent to your email" });
  } catch (err) {
    console.error("Error in resendOtp:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const now = new Date();

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otpData = await OTP.findOne({
      where: {
        email,
        otp_code: otp,
      },
    });

    if (!otpData) {
      return res.status(400).json({ error: "Invalid OTP or email" });
    }

    if (otpData.expires_at < now) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (user.is_verified) {
      if (!password) {
        return res
          .status(400)
          .json({
            error: "User already verified . Give password for update password.",
          });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await user.update({ password: hashedPassword });
      return res.status(200).json({ message: "Password updated successfully" });
    }

    // Update user as verified
    await User.update({ is_verified: true }, { where: { email } });
    await OTP.destroy({ where: { email } });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        error: "Email not verified. Please verify your email first.",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (user.is_blocked) {
      return res.status(403).json({ error: "User is blocked" });
    }

    const payload = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      phone: user.phone,
      student: user.student,
      tutor: user.tutor,
      admin: user.admin,
      is_verified: user.is_verified,
      is_blocked: user.is_blocked,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      student: user.student,
      tutor: user.tutor,
      admin: user.admin,
      is_blocked: user.is_blocked,
      is_verified: user.is_verified,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
};

const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const expiresAt = new Date(decoded.exp * 10000);

    await RevokedToken.create({ token, expires_at: expiresAt });

    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
};
const saveFcmToken = async (req, res) => {
  const { token } = req.body;
  const userId = req.user.userId;

  if (!token) return res.status(400).json({ message: "Token is required" });

  await User.update({ fcmToken: token }, { where: { userId } });

  res.json({ success: true, message: "FCM token saved" });
};
const googleAuthLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "", // Optional
        phone: "",     // Optional
        student: true,
        tutor: false,
        admin: false,
        is_verified: true,
        is_blocked: false,
      });
    }

    if (user.is_blocked) {
      return res.status(403).json({ error: "User is blocked" });
    }

    const jwtPayload = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      student: user.student,
      tutor: user.tutor,
      admin: user.admin,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Google login successful",
      token,
      user: jwtPayload,
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(401).json({ error: "Google login failed" });
  }

};
module.exports = {
  googleAuthLogin,
  signup,
  resendOtp,
  verifyEmailOtp,
  login,
  logout,
  saveFcmToken,
};
