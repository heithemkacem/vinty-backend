// routes/auth.js
const express = require("express");
const {
  uploadSingleImage,
  uploadMultipleImages,
} = require("./images-controller");
const { upload } = require("../../config/amazon");

const router = express.Router();

router.post("/single-image", upload.single("image"), uploadSingleImage);
router.post("/multiple-image", upload.array("images"), uploadMultipleImages);
module.exports = router;
