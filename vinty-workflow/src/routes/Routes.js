const express = require("express");
const categories = require("../Domains/Category/categories-routes");
const subCategories = require("../domains/Sub-categories/sub-categories-routes");
const vendingMachines = require("../domains/Vending-machine/vending-machine-route");
const products = require("../domains/Products/product-routes");
const client = require("../domains/Client/Client-route");
const admin = require("../domains/Admin/admin-routes");
const machineOwner = require("../domains/Vending-machine-owner/vending-machine-owner-routes");
const router = express.Router();


router.use("/category", categories);
router.use("/sub-Category", subCategories);
router.use("/vending-machine", vendingMachines);
router.use("/product", products);
router.use("/clients", client);
router.use("/admin", admin);
router.use("/owner", machineOwner);

module.exports = router;
