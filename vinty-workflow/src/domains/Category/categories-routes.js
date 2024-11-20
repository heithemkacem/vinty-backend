const express = require("express");
const router = express.Router();
const categoryController = require("./categories-controller");
const authorize = require("../../middleware/authorize");
const auth = require("../../middleware/auth");

router.post("/categories", auth,  authorize('admin') ,categoryController.createCategory);

router.get("/categories",  categoryController.getCategories);

router.get("/categories/one/:id", categoryController.getCategoryById);

router.put("/categories/:id",auth ,authorize('admin'),  categoryController.updateCategory);
    
router.delete("/categories/:id",auth,authorize('admin'), categoryController.deleteCategory);

router.get("/categories/type/:type",auth, categoryController.getCategoriesByType);
router.get("/categories/type/",categoryController.getCategoriesBothTypes);

module.exports = router;
