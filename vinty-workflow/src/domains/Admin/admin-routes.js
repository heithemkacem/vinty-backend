const express = require("express");
const adminController = require("./admin-controller");
const router = express.Router();

router.post("/create", adminController.createAdmin);
router.get("/owners", adminController.getAllOwnersWithVendingMachineCount);
router.get("/owners/:adminId/search", adminController.searchOwnerByNameOrEmail);
router.get("/:adminId/search-list", adminController.viewAdminSearchList);
router.delete(
  "/:adminId/search-list/item",
  adminController.deleteAdminSearchListItem
);
router.delete("/:adminId/search-list", adminController.clearAdminSearchList);
router.delete("/owner/:ownerId", adminController.deleteVendingMachineOwner);
router.put("/owner/:ownerId", adminController.updateVendingMachineOwner);

module.exports = router;
