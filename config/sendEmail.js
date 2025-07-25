// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const sendEmail = async (to, subject, html) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     html,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, otp) => {
  if (!to) {
    throw new Error("Recipient email (to) is required");
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
   <html>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet">
  </head>
  <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Quicksand', Arial, sans-serif;">

    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; padding: 40px 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e5e9f2;">
      
      <h2 style="color: #2D3A4B; font-size: 28px; margin-bottom: 10px;">🚀 Welcome to <span style="color: #009688;">EduMate</span></h2>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">Hi there 👋,</p>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">We’re thrilled to have you on board. To get started, please use the OTP below to verify your email address:</p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background: #f2f5f9; color: #2D3A4B; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 20px 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
          ${otp}
        </span>
      </div>

      <p style="font-size: 14px; color: #777; text-align: center;">⏰ This OTP is valid for <strong>10 minutes</strong>. Please don’t share it with anyone.</p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">

      <p style="font-size: 13px; color: #999; line-height: 1.5;">Didn’t request this email? No worries — you can safely ignore it. Your account will not be created unless the OTP is used.</p>

      <p style="font-size: 13px; color: #aaa; margin-top: 30px;">With 💚,<br>The EduMate Team</p>
    </div>

  </body>
</html>

  `;

  const mailOptions = {
    from: `"EduMate 📚" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
