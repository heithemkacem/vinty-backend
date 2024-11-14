

const express = require('express');
const vendingMachineOwnerController = require('./Vending-machine-owner-controllers');
const router = express.Router();


router.get('/:ownerId', vendingMachineOwnerController.getVendingMachinesByOwner)
router.post('/product/', vendingMachineOwnerController.createProduct)
router.delete('/remove/:vendingMachineId/:productId', vendingMachineOwnerController.removeProductFromVendingMachine);


module.exports = router;
