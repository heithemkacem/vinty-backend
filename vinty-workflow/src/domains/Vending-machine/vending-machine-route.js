const express = require('express');
const router = express.Router();
const vendingMachineController = require('./vending-machine-controller');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');


router.post('/', auth, authorize('vending-machine-owner'), vendingMachineController.createVendingMachine);
router.get('/', auth, vendingMachineController.getAllVendingMachines);
router.get('/details', auth, vendingMachineController.getVendingMachineById);
router.put('/update', auth, authorize('vending-machine-owner'), vendingMachineController.updateVendingMachine);
router.delete('/delete', auth, authorize('vending-machine-owner'), vendingMachineController.deleteVendingMachine);
router.get('/machines/search', auth, vendingMachineController.searchVendingMachines);
router.get('/machines/locations', auth, vendingMachineController.getAllVendingMachineCoordinates);

router.patch('/toggle-block', auth, authorize('admin'), vendingMachineController.toggleBlockVendingMachine); 
router.patch('/location', auth, authorize('vending-machine-owner'), vendingMachineController.updateVendingMachineLocation); 
router.post('/products', auth, authorize('vending-machine-owner'), vendingMachineController.addProductsToVendingMachine); 
router.patch('/products/prices', auth, authorize('vending-machine-owner'), vendingMachineController.setProductPrices);

module.exports = router;
