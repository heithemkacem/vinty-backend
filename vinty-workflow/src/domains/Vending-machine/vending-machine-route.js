const express = require('express');
const router = express.Router();
const vendingMachineController = require('./vending-machine-controller');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');

// Vending machine management (CRUD)
router.post('/', auth, authorize('vending-machine-owner'), vendingMachineController.createVendingMachine);
router.get('/', auth, vendingMachineController.getAllVendingMachines);
router.get('/details', auth, vendingMachineController.getVendingMachineById); // ID in req.body
router.put('/update', auth, authorize('vending-machine-owner'), vendingMachineController.updateVendingMachine); // ID in req.body
router.delete('/delete', auth, authorize('vending-machine-owner'), vendingMachineController.deleteVendingMachine); // ID in req.body
router.get('/machines/search', auth, vendingMachineController.searchVendingMachines);
router.get('/machines/locations', auth, vendingMachineController.getAllVendingMachineCoordinates);

router.patch('/toggle-block', auth, authorize('admin'), vendingMachineController.toggleBlockVendingMachine); // ID in req.body
router.patch('/location', auth, authorize('vending-machine-owner'), vendingMachineController.updateVendingMachineLocation); // ID in req.body
router.post('/products', auth, authorize('vending-machine-owner'), vendingMachineController.addProductsToVendingMachine); // ID in req.body

module.exports = router;
