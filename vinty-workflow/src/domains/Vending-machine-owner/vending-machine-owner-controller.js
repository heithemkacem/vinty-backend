// controllers/vendingMachineOwnerController.js

const {VendingMachineOwner} = require("../../models");
const {Product} = require("../../models");
const {VendingMachine} = require("../../models");
const createErrorResponse = require("../../Utils/Error-handle");


exports.getVendingMachinesByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const vendingMachines = await VendingMachine.find({ owner: ownerId });

    if (!vendingMachines.length) {
      return res
        .status(404)
        .json({ message: "No vending machines found for this owner" });
    }

    res
      .status(200)
      .json({
        message: "Vending machines retrieved successfully",
        vendingMachines,
      });
  } catch (error) {
    console.error("Error retrieving vending machines:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addProductToVendingMachine = async (req, res) => {
  try {
    const { productId, vendingMachineId } = req.body;

    // Validate input
    if (!productId || !vendingMachineId) {
      return res
        .status(400)
        .json({ message: "Product ID and Vending Machine ID must be provided." });
    }

    // Find the vending machine
    const vendingMachine = await VendingMachine.findById(vendingMachineId);
    if (!vendingMachine) {
      return res.status(404).json({ message: "Vending Machine not found" });
    }

    // Check if the product already exists
    if (vendingMachine.products.includes(productId)) {
      return res.status(400).json({ message: "Product already exists in the vending machine." });
    }

    // Add the product to the vending machine
    vendingMachine.products.push(productId);
    await vendingMachine.save();

    res.status(200).json({
      message: "Product added to vending machine successfully",
      vendingMachine,
    });
  } catch (error) {
    console.error("Error adding product to vending machine:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeProductFromVendingMachine = async (req, res) => {
  try {
    const { vendingMachineId, productId } = req.params;
    const vendingMachine = await VendingMachine.findById(vendingMachineId);
    if (!vendingMachine) {
      return res.status(404).json({ message: "Vending Machine not found" });
    }
    const productIndex = vendingMachine.products.indexOf(productId);
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in this vending machine" });
    }
    vendingMachine.products.splice(productIndex, 1);
    await vendingMachine.save();
    await Product.findByIdAndRemove(productId);

    res
      .status(200)
      .json({ message: "Product removed from vending machine successfully" });
  } catch (error) {
    console.error(
      "Error removing product from vending machine:",
      error.message
    );
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateVendingMachineOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const owner = await VendingMachineOwner.findByIdAndUpdate(id, updates, { new: true });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteVendingMachineOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await VendingMachineOwner.findByIdAndDelete(id);
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.status(200).json({ message: 'Owner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
