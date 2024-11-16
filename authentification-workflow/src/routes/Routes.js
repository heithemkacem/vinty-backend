const express = require("express");
const otpRoutes = require("../domains/Otp/otp-route");
const authRoutes = require("../domains/Auth/auth-routes");
const router = express.Router();
router.use("/otp", otpRoutes);
router.use("/auth", authRoutes);

module.exports = router;
