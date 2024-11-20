const crypto = require("crypto");
const bcrypt = require("bcrypt");

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};

const generateAndHashOTP = async () => {
  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);
  return { otp, hashedOtp };
};

module.exports = { generateAndHashOTP };
