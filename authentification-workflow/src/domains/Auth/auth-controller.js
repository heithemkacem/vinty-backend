const { Profile, Client, VendingMachineOwner, Admin } = require("../../models");

const jwt = require("jsonwebtoken");
const { OTP, sendVerificationEmail } = require("../../models/OTP/otp.js");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const { registerSchema } = require("../../utils/Validators.js");
const axios = require("axios");
const { generateAndHashOTP } = require("../../Utils/Generate-otp.js");
require("dotenv").config();
const { createErrorResponse } = require("../../Utils/Error-handle.js");
const mailSender = require("../../Utils/Mail-sender.js");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// Google Login
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const { data: profile } = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );
    
    let user = await Profile.findOne({ email: profile.email });

    if (!user) {
      user = new Profile({
        fullName: profile.name,
        email: profile.email,
        role: "user",
        isVerified: true,
        source: "Google",
      });
      await user.save();
    }

    // Retrieve or create associated client info
    let client = await Client.findOne({ profileId: user._id });
    if (!client) {
      client = new Client({ profileId: user._id });
      await client.save();
    }

    // Structure the user data the same way as in the normal login
    const userData = {
      _id: user._id,
      name: user.fullName,
      email: user.email,
      // Add any other necessary fields
    };

    // Generate the JWT token with role and user data
    const token = jwt.sign(
      {
        role: user.role,
        userData, 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } 
    );

    res.status(200).json({
      token,
      ok: true,
      client: {
        id: client._id,
        favorites: client.favorites,
        recent_search: client.recent_search,
        location: client.location,
        lat_long: {
          lat: client.lat_long.lat,
          long: client.lat_long.long,
        },
        blocked: client.blocked,
        block_reason: client.block_reason,
        blocked_at: client.blocked_at,
      },
    });
  } catch (error) {
    console.error(
      "Google Authentication Error:",
      error.response?.data?.error || error.message
    );
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};


exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const { error } = registerSchema.validate({ fullName, email, password });
    if (error) {
      return res
        .status(400)
        .json(createErrorResponse(error.details[0].message, 400));
    }

    const existingUser = await Profile.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(createErrorResponse("Email already registered", 400));
    }

    const profile = new Profile({ fullName, email, password, role });
    await profile.save();

    if (role === "user") {
      const client = new Client({
        profileId: profile._id,
        name: fullName,
        email: email,
        favorites: [],
        recent_search: [],
        location: "",
        lat_long: { lat: 0, long: 0 },
        blocked: false,
        block_reason: "",
        blocked_at: null,
      });
      await client.save();
    } else if (role === "vending-machine-owner") {
      const vendingMachineOwner = new VendingMachineOwner({
        profileId: profile._id,
        fullName,
        email,
        vendingMachines: [],
      });
      await vendingMachineOwner.save();
    }

    // Generate and hash OTP
    const { otp, hashedOtp } = await generateAndHashOTP();
    const otpPayload = {
      email,
      otp: hashedOtp,
      type: "emailVerification",
      userId: profile._id,
    };
    await OTP.create(otpPayload);
    await mailSender(email, "Your OTP", `<h1>Your OTP is: ${otp}</h1>`).catch(
      (mailError) => {
        console.error("Error sending OTP email:", mailError);
        return res
          .status(500)
          .json(createErrorResponse("Error sending email", 500));
      }
    );

    res.status(201).json({
      ok: true,
      message: "Profile created successfully and OTP sent",
      profile: {
        id: profile._id,
        fullName: profile.fullName,
        email: profile.email,
        role: profile.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const profile = await Profile.findOne({ email });
    if (!profile) {
      return res
        .status(400)
        .json(createErrorResponse("Invalid email or password", 400));
    }

    if (!profile.isVerified) {
      return res
        .status(403)
        .json(
          createErrorResponse(
            "Account not verified. Please verify your account.",
            403
          )
        );
    }

    const isValidPassword = await profile.isPasswordValid(password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json(createErrorResponse("Invalid email or password", 400));
    }
    let user = null;
    let userRole = profile.role;
    let userId = null;
    let userData = null;

    if (userRole === "admin") {
      user = await Admin.findOne({ profileId: profile._id });
      if (user) {
        userId = user._id;
        userData = user;
      }
    } else if (userRole === "vending-machine-owner") {
      user = await VendingMachineOwner.findOne({ profileId: profile._id });
      console.log("hahaha");
      if (user) {
        userId = user._id;
        userData = user;
      }
    } else if (userRole === "user") {
      user = await Client.findOne({ profileId: profile._id });
      if (user) {
        userId = user._id;
        userData = user;
      }
    }
    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json(createErrorResponse("User role not found", 404));
    }

    const token = jwt.sign(
      {
        role: userRole,
        userData,
      },

      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      ok: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};
