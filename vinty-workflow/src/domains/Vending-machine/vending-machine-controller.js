
const {Product,SubCategory,Category,VendingMachineOwner,Client,VendingMachine} = require("../../models");
const { createErrorResponse } = require("../../Utils/Error-handle");


const updateRecentSearch = async (clientId, searchTerm) => {
  try {
    await Client.findByIdAndUpdate(
      clientId,
      { $addToSet: { recent_search: searchTerm } },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating recent searches:", error);
  }
};


exports.createVendingMachine = async (req, res) => {
  try {
    const { name, ownerId, location, position, openDays, openHours } = req.body;


  
    const products = req.body.products || [];

    // Verify owner
    const owner = await VendingMachineOwner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const newVendingMachine = new VendingMachine({
      name,
      location,
      openDays,  
      openHours, 
      position,
      owner: ownerId,
      products : products
    
    });

    await newVendingMachine.save();

    owner.vendingMachines.push(newVendingMachine._id);
    await owner.save();

    res.status(201).json({
      message: "Vending Machine created successfully",
      vendingMachine: newVendingMachine,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllVendingMachines = async (req, res) => {
  try {
    const vendingMachines = await VendingMachine.find().populate({
      path: "products",
      populate: [
        { path: "category", model: "Category" },
        { path: "subCategory", model: "SubCategory" },
      ],
    });

    res.status(200).json(vendingMachines);
  } catch (error) {
    console.error("Error fetching vending machines:", error);
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.getVendingMachineById = async (req, res) => {
  try {
    const vendingMachine = await VendingMachine.findOne({
      _id: req.params.id,
    }).populate({
      path: "products",
      populate: [
        { path: "category", model: "Category" },
        { path: "subCategory", model: "SubCategory" },
      ],
    });

    if (!vendingMachine) {
      return res
        .status(404)
        .json({ message: "Vending machine not found or is blocked" });
    }
    res.status(200).json(vendingMachine);
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.updateVendingMachine = async (req, res) => {
  try {
    const vendingMachine = await VendingMachine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!vendingMachine) {
      return res
        .status(404)
        .json(createErrorResponse("Vending Machine not found", 404));
    }
    res
      .status(200)
      .json({
        message: "Vending Machine updated successfully",
        vendingMachine,
      });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

// Delete a vending machine
exports.deleteVendingMachine = async (req, res) => {
  try {
    const vendingMachine = await VendingMachine.findByIdAndDelete(
      req.params.id
    );
    if (!vendingMachine) {
      return res
        .status(404)
        .json(createErrorResponse("Vending Machine not found", 404));
    }
    res.status(200).json({ message: "Vending Machine deleted successfully" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.searchVendingMachines = async (req, res) => {
  const clientId = req.user.userData._id;
  const { searchTerm } = req.body;

  if (!searchTerm || !clientId) {
    return res
      .status(400)
      .json({ message: "Search term and client ID are required" });
  }

  try {
    // Update recent search
    await updateRecentSearch(clientId, searchTerm);

    let categories, subCategories, products;

    // Search categories, subcategories, and products
    try {
      categories = await Category.find({ title: new RegExp(searchTerm, "i") });
      subCategories = await SubCategory.find({
        title: new RegExp(searchTerm, "i"),
      });
      products = await Product.find({
        $or: [
          { name: new RegExp(searchTerm, "i") },
          { subName: new RegExp(searchTerm, "i") },
        ],
      });
    } catch (error) {
      console.error("Error finding search results:", error);
      return res.status(500).json({
        message: "Error retrieving categories, subcategories, or products",
        error,
      });
    }

    // Collect IDs for search criteria
    const categoryIds = categories.map((cat) => cat._id);
    const subCategoryIds = subCategories.map((subCat) => subCat._id);
    const productIds = products.map((prod) => prod._id);

    // Find vending machines matching the criteria and not blocked
    const vendingMachines = await VendingMachine.find({
      $or: [
        { name: new RegExp(searchTerm, "i") }, // Search by vending machine name
        { products: { $in: productIds } },
        { "products.category": { $in: categoryIds } },
        { "products.subCategory": { $in: subCategoryIds } },
      ],
    }).populate({
      path: "products",
      populate: [
        { path: "category", model: "Category" },
        { path: "subCategory", model: "SubCategory" },
      ],
    });

    res.status(200).json(vendingMachines);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
;


exports.getAllVendingMachineCoordinates = async (req, res) => {
  try {
    const coordinates = await VendingMachine.find({}, "position");
    res.status(200).json({ coordinates });
  } catch (error) {
    console.error("Error fetching vending machine coordinates:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleBlockVendingMachine = async (req, res) => {
  try {
    const { machineId } = req.params;
    const machine = await VendingMachine.findById(machineId);
    if (!machine)
      return res.status(404).json({ message: "Vending machine not found" });

    machine.blocked = !machine.blocked;
    await machine.save();
    res
      .status(200)
      .json({
        message: `Vending machine ${machine.blocked ? "blocked" : "unblocked"}`,
        machine,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
