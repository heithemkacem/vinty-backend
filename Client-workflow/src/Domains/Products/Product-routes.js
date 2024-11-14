// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('./products-controllers');

// CRUD routes for products
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id/products', productController.getProductsByVendingMachineId);
router.get('/:categoryId/products', productController.getProductsForCategory);


module.exports = router;
