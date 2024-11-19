const express = require("express");
const ImagesRoutes = require("../domains/Images/images-routes");
const router = express.Router();
router.use("/upload", ImagesRoutes);

module.exports = router;
