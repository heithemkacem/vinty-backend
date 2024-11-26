// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("./products-controller");

// CRUD routes for products
router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/products/machine", productController.getProductsByVendingMachineId);
router.get("/:categoryId/categories/products", productController.getProductsForCategory);

module.exports = router;
