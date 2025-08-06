const OTP = require('../models/OTP');
const sendEmail = require('../config/sendEmail');
const generateAndSendOtp = async (email, purpose = "verification") => {
  if (!email) throw new Error("Email is required to generate OTP");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 
  try {
    await OTP.deleteOldOtps(email);
  } catch (err) {
    console.warn("Failed to delete old OTPs:", err);
  }
  await OTP.createOtp(email, otp, expiresAt);
  const subject = purpose === "verification" 
    ? "🔐 Verify Your Email - EduMate" 
    : "🔄 Resend OTP - EduMate";
  await sendEmail(email, subject, otp); 
  return { otp, expiresAt };
};
module.exports = {
  generateAndSendOtp
};
