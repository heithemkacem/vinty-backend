const { OTP } = require("../../models/OTP/otp.js");
const Profile = require("../../models/Profile/profile.js");
const mailSender = require("../../Utils/Mail-sender.js");
const bcrypt = require("bcrypt");
const { generateAndHashOTP } = require("../../Utils/Generate-otp.js");
const { createErrorResponse } = require("../../Utils/Error-handle.js");

exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const otpRecord = await OTP.findOne({ userId, type: "emailVerification" });
    if (!otpRecord)
      return res
        .status(400)
        .json(createErrorResponse("Invalid or expired OTP", 400));

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch)
      return res
        .status(400)
        .json(createErrorResponse("Invalid or expired OTP", 400));

    await Profile.findByIdAndUpdate(userId, { isVerified: true });
    await OTP.deleteMany({ userId, type: "emailVerification" });

    res
      .status(200)
      .json({ ok: true, message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.resendOTP = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { email } = req.body;
    const user = await Profile.findOne({ email });
    if (!user)
      return res.status(404).json(createErrorResponse("User not found", 404));

    console.log("User ID:", user._id);

    // Check for existing OTP records before deletion
    const existingOtps = await OTP.find({
      userId: user._id,
      type: "emailVerification",
    });
    if (existingOtps.length > 0) {
      const deleteResult = await OTP.deleteMany({
        userId: user._id,
        type: "emailVerification",
      });
      console.log("Deleted OTP records:", deleteResult.deletedCount);
    } else {
      console.log("No existing OTP records found for deletion.");
    }

    const { otp, hashedOtp } = await generateAndHashOTP();
    console.log("Generated OTP:", otp, "Hashed OTP:", hashedOtp);

    const newOtpRecord = new OTP({
      userId: user._id,
      otp: hashedOtp,
      email: email,
      createdAt: Date.now(),
      type: "emailVerification",
    });

    await newOtpRecord.save();

    await mailSender(email, "Your OTP", `<h1>Your OTP is: ${otp}</h1>`).catch(
      (mailError) => {
        console.error("Error sending OTP email:", mailError);
        return res
          .status(500)
          .json(createErrorResponse("Error sending email", 500));
      }
    );

    res.status(200).json({ ok: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error in resendOTP:", error); // Log the error
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Profile.findOne({ email });
    if (!user)
      return res.status(404).json(createErrorResponse("Email not found", 404));

    const existingOtp = await OTP.findOne({
      userId: user._id,
      type: "passwordReset",
    });
    if (existingOtp && Date.now() - existingOtp.createdAt.getTime() < 60000) {
      return res
        .status(429)
        .json(
          createErrorResponse(
            "Please wait a minute before requesting another OTP",
            429
          )
        );
    }

    const { otp, hashedOtp } = await generateAndHashOTP();
    await OTP.findOneAndUpdate(
      { userId: user._id, type: "passwordReset" },
      { otp: hashedOtp, createdAt: Date.now() },
      { upsert: true }
    );

    await mailSender(
      email,
      "Password Reset OTP",
      `<h1>Your OTP is: ${otp}</h1>`
    );
    res.status(200).json({ ok: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.verifyPasswordResetOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const otpRecord = await OTP.findOne({ userId, type: "passwordReset" });
    if (!otpRecord)
      return res
        .status(400)
        .json(createErrorResponse("Invalid or expired OTP", 400));

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch)
      return res
        .status(400)
        .json(createErrorResponse("Invalid or expired OTP", 400));

    await OTP.deleteMany({ userId, type: "passwordReset" });
    res
      .status(200)
      .json({ ok: true, message: "OTP verified, proceed to reset password" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Profile.findOneAndUpdate({ email }, { password: hashedPassword });

    res.status(200).json({ ok: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};
