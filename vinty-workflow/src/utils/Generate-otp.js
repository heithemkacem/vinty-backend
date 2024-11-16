const bcrypt = require('bcrypt');

function generateOTP(length = 6) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); 
  }
  return otp;
}

async function generateAndHashOTP() {
  const otp = generateOTP(6);
  const hashedOtp = await bcrypt.hash(otp, 10);
  return { otp, hashedOtp };
}

module.exports = {
  generateOTP,
  generateAndHashOTP,
};
