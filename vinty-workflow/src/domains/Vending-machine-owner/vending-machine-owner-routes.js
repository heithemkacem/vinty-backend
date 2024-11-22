const express = require("express");
const vendingMachineOwnerController = require("./vending-machine-owner-controller");
const router = express.Router();
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');

router.get(
  "/:ownerId",
  vendingMachineOwnerController.getVendingMachinesByOwner
);
router.post("/product/", vendingMachineOwnerController.createProduct);
router.delete(
  "/remove/:vendingMachineId/:productId",
  vendingMachineOwnerController.removeProductFromVendingMachine
);
router.put('/:id',auth,authorize('vending-machine-owner'),vendingMachineOwnerController.updateVendingMachineOwner); 
router.delete('/:id',auth,authorize('vending-machine-owner'),vendingMachineOwnerController.deleteVendingMachineOwner); 


module.exports = router;
