// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log("Authenticated User:", req.user); 
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
