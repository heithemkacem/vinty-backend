const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (requiredRole = null) => (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied: No token provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user data to request object

    // If a specific role is required, check it
    if (requiredRole && req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: `Access denied: Only ${requiredRole}s allowed` });
    }

    console.log("Authenticated User:", req.user);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = auth;
