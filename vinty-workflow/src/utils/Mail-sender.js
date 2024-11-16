require('dotenv').config();
const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
  
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    let info = await transporter.sendMail({
      from: 'www.sandeepdev.me - Sandeep Singh',
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender;
