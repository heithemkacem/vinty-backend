const express = require('express');
const router = express.Router();
const vendingMachineController = require('./vending-machine-controller');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');

// Vending machine management (CRUD)
router.post('/', auth, authorize('admin'), vendingMachineController.createVendingMachine); 
router.get('/', auth, vendingMachineController.getAllVendingMachines);
router.get('/:id', auth, vendingMachineController.getVendingMachineById); 
router.put('/:id', auth, authorize('admin'), vendingMachineController.updateVendingMachine);
router.delete('/:id', auth, authorize('admin'), vendingMachineController.deleteVendingMachine); 
router.get('/machines/search', auth, vendingMachineController.searchVendingMachines); 
router.get('/machines/locations', auth, vendingMachineController.getAllVendingMachineCoordinates); 

router.patch('/:id/toggle-block', auth, authorize('admin'), vendingMachineController.toggleBlockVendingMachine);

module.exports = router;
