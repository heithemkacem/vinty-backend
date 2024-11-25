const express = require('express');
const router = express.Router();
const vendingMachineController = require('./vending-machine-controller');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');

// Vending machine management (CRUD)
router.post('/', auth,authorize('vending-machine-owner'), vendingMachineController.createVendingMachine); 
router.get('/', auth, vendingMachineController.getAllVendingMachines);
router.get('/:id', auth, vendingMachineController.getVendingMachineById); 
router.put('/:id', auth, authorize('vending-machine-owner'), vendingMachineController.updateVendingMachine);
router.delete('/:id', auth, authorize('vending-machine-owner'), vendingMachineController.deleteVendingMachine); 
router.get('/machines/search', auth, vendingMachineController.searchVendingMachines); 
router.get('/machines/locations', auth, vendingMachineController.getAllVendingMachineCoordinates); 

router.patch('/:id/toggle-block', auth, authorize('admin'), vendingMachineController.toggleBlockVendingMachine);

router.patch('/:id/location', auth, authorize('vending-machine-owner'), vendingMachineController.updateVendingMachineLocation);
router.post('/:id/products', auth, authorize('vending-machine-owner'), vendingMachineController.addProductsToVendingMachine);
module.exports = router;
