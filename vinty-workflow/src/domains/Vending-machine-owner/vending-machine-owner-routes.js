const express = require("express");
const vendingMachineOwnerController = require("./vending-machine-owner-controller");
const router = express.Router();

router.get(
  "/:ownerId",
  vendingMachineOwnerController.getVendingMachinesByOwner
);
router.post("/product/", vendingMachineOwnerController.createProduct);
router.delete(
  "/remove/:vendingMachineId/:productId",
  vendingMachineOwnerController.removeProductFromVendingMachine
);
router.put('/:id', vendingMachineOwnerController.updateVendingMachineOwner); 
router.delete('/:id',vendingMachineOwnerController.deleteVendingMachineOwner); 


module.exports = router;
