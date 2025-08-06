const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendEnrollmentMail = async ({ to, courseName, userName, courseId }) => {
  await transporter.sendMail({
    from: `"EduMate" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎉 You're Enrolled in ${courseName}!`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background: #f2f7f6; padding: 40px 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">
    <!-- App Name Banner -->
    <div style="background: #009688; color: #ffffff; padding: 12px 20px; font-size: 18px; font-weight: bold;">
      EduMate 📚
    </div>
    <!-- Welcome Header -->
    <div style="background: linear-gradient(135deg, #009688, #33ab9f); color: #fff; padding: 30px 40px;">
      <h1 style="margin: 0; font-size: 28px;">🎉 You're In!</h1>
      <p style="margin: 8px 0 0; font-size: 18px;">Welcome to EduMate, ${userName} 👋</p>
    </div>
    <!-- Body Content -->
    <div style="padding: 30px 40px; color: #333;">
      <p style="font-size: 16px; line-height: 1.6;">
        Boom 💥 You’ve successfully enrolled in<br/>
        <strong style="font-size: 18px; color: #009688;">${courseName}</strong>
      </p>
      <p style="font-size: 15px; color: #555;">
        Your learning journey begins now. Let’s do this! 🙌
      </p>
      <!-- CTA Button -->
      <a href="https://yourplatform.com/courses/${courseId}" 
         style="display: inline-block; margin-top: 25px; padding: 14px 28px; background-color: #009688; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: background 0.3s ease;">
        🚀 Start Learning Now
      </a>
      <!-- Divider -->
      <hr style="margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;">
      <!-- Footer Note -->
      <p style="font-size: 13px; color: #999; text-align: center;">
        Didn’t sign up on EduMate? No worries. Just reach out to our support team.<br/>
        We gotchu 💬
      </p>
    </div>
  </div>
</div>
    `,
  });
};
module.exports = sendEnrollmentMail;
