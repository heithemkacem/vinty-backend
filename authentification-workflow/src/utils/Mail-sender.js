require('dotenv').config();
const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER || "871a69042c2713",
        pass: process.env.SMTP_PASS || "54c316d22e4dd4",
      },
    });

    const info = await transporter.sendMail({
      from: '"Your Service" <noreply@yourdomain.com>',
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error in mailSender:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = mailSender;
