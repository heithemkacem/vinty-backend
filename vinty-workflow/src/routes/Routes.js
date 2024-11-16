const express = require("express");
const categories = require("../Domains/Category/Categories-routes");
const subCategories = require("../Domains/Sub-categories/Subcategories-routes");
const vendingMachines = require("../Domains/Vending-machine/VendingMachine-routes");
const products = require("../Domains/Products/Product-routes");
const client = require("../Domains/Client/Client-route");
const admin = require("../Domains/Admin/Admin-routes");
const machineOwner = require("../Domains/Vending-vending-machine-owner/Vending-vending-machine-owner-routes");
const router = express.Router();

router.use("/category", categories);
router.use("/sub-Category", subCategories);
router.use("/vending-machine", vendingMachines);
router.use("/product", products);
router.use("/clients", client);
router.use("/admin", admin);
router.use("/owner", machineOwner);

module.exports = router;
