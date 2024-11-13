// routes/vendingMachineRoutes.js
const express = require('express');
const router = express.Router();
const vendingMachineController = require('./VendingMachine-controllers');
const adminCheck = require('../../Middleware/Authorize');
const filterUnblocked = require('../../Middleware/filter-unblocked')

router.post('/', vendingMachineController.createVendingMachine);
router.get('/', filterUnblocked,vendingMachineController.getAllVendingMachines);
router.get('/:id',filterUnblocked, vendingMachineController.getVendingMachineById);
router.put('/:id', vendingMachineController.updateVendingMachine);
router.delete('/:id', vendingMachineController.deleteVendingMachine);
router.get('/machines/search',filterUnblocked, vendingMachineController.searchVendingMachines);
router.get('/machines/lcoations', vendingMachineController.getAllVendingMachineCoordinates);
router.patch('/:machineId/toggle-block',  vendingMachineController.toggleBlockVendingMachine);



module.exports = router;
