const express = require("express");
const adminController = require("./admin-controller");
const router = express.Router();
const auth = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");

// Routes
router.post("/create", adminController.createAdmin);
router.get("/owners", auth, authorize("admin"), adminController.getAllOwnersWithVendingMachineCount);
router.get("/owners/search", auth, authorize("admin"), adminController.searchOwnerByNameOrEmail);
router.get("/search-list", auth, authorize("admin"), adminController.viewAdminSearchList);
router.delete("/search-list/item", auth, authorize("admin"), adminController.deleteAdminSearchListItem);
router.delete("/search-list", auth, authorize("admin"), adminController.clearAdminSearchList);
router.delete("/owner", auth, authorize("admin"), adminController.deleteVendingMachineOwner); 
router.put("/owner", auth, authorize("admin"), adminController.updateVendingMachineOwner); 
router.put("/", auth, authorize("admin"), adminController.updateAdmin); // Removed `:id`
router.delete("/", auth, authorize("admin"), adminController.deleteAdmin); // Removed `:id`


module.exports = router;
