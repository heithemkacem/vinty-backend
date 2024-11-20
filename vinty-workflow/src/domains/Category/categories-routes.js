const express = require("express");
const router = express.Router();
const categoryController = require("./categories-controller");
const authorize = require("../../middleware/authorize");
const auth = require("../../middleware/auth");

router.post("/categories", auth, categoryController.createCategory);

router.get("/categories", auth, categoryController.getAllCategories);

router.get("/categories/one/:id", categoryController.getCategoryById);

router.put("/categories/:id", categoryController.updateCategory);

router.delete("/categories/:id", categoryController.deleteCategory);

router.get("/categories/type/:type", categoryController.getCategoriesByType);

module.exports = router;
