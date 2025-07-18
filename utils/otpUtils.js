const OTP = require('../models/OTP');
const  sendEmail  = require('../config/sendEmail');

const generateAndSendOtp = async (email, purpose = "verification") => {
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  // Delete any old OTPs first
  try {
    await OTP.deleteOldOtps(email);
  } catch (err) {
    console.error("Error deleting old OTPs:", err);
    // Continue even if deletion fails
  }
  

  // Save new OTP
  await OTP.createOtp(email, otp, expiresAt);

  // Send email
  const subject = purpose === "verification" 
    ? "Verify your email" 
    : "Resend OTP - Verify your email";
  
  const message = `<p>Your OTP is: <b>${otp}</b></p>`;
  await sendEmail(email, subject, message);

  return { otp, expiresAt };
};

module.exports = {
  generateAndSendOtp
};