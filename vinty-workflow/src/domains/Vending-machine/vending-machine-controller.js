const {
  Product,
  SubCategory,
  Category,
  VendingMachineOwner,
  Client,
  VendingMachine,
} = require("../../models");
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
    const {
      name,
      description,
      paymentMethods = ["Cash"], 
      openDays,
      openHours,
      alwaysOpen,
    } = req.body;

    // Validate the owner
    const ownerId = req.user.userData._id;
    const owner = await VendingMachineOwner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Validate open hours if not always open
    if (!alwaysOpen && (!openHours || !openHours.start || !openHours.end)) {
      return res.status(400).json({
        message:
          "Open hours are required if the vending machine is not always open.",
      });
    }

    // Create a vending machine with the simplified fields
    const newVendingMachine = new VendingMachine({
      name,
      description,
      paymentMethods,
      openDays,
      openHours: alwaysOpen ? undefined : openHours,
      alwaysOpen: alwaysOpen || false,
      owner: ownerId,
    });

    // Save the vending machine
    await newVendingMachine.save();

    // Add to the owner's vending machine list
    owner.vendingMachines.push(newVendingMachine._id);
    await owner.save();

    res.status(201).json({
      message: "Vending Machine created successfully",
      vendingMachine: newVendingMachine,
    });
  } catch (error) {
    console.error("Error creating vending machine:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllVendingMachines = async (req, res) => {
  try {
    const vendingMachines = await VendingMachine.find()
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
    const { id, ...updateData } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Vending Machine ID is required" });
    }

    const vendingMachine = await VendingMachine.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!vendingMachine) {
      return res.status(404).json({ message: "Vending Machine not found" });
    }

    res.status(200).json({
      message: "Vending Machine updated successfully",
      vendingMachine,
    });
  } catch (error) {
    console.error("Error updating vending machine:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteVendingMachine = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Vending Machine ID is required" });
    }

    const vendingMachine = await VendingMachine.findByIdAndDelete(id);

    if (!vendingMachine) {
      return res.status(404).json({ message: "Vending Machine not found" });
    }

    res.status(200).json({ message: "Vending Machine deleted successfully" });
  } catch (error) {
    console.error("Error deleting vending machine:", error.message);
    res.status(500).json({ message: "Server error", error });
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
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Vending machine ID is required" });
    }

    const vendingMachine = await VendingMachine.findById(id);

    if (!vendingMachine) {
      return res.status(404).json({ message: "Vending machine not found" });
    }

    vendingMachine.isBlocked = !vendingMachine.isBlocked;
    await vendingMachine.save();

    res.status(200).json({
      message: `Vending machine is now ${
        vendingMachine.isBlocked ? "blocked" : "unblocked"
      }`,
      vendingMachine,
    });
  } catch (error) {
    console.error("Error toggling block status:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateVendingMachineLocation = async (req, res) => {
  try {
    const { id, position, location } = req.body;
    console.log(id, location, position);
    if (!id) {
      return res
        .status(400)
        .json({ message: "Vending machine ID is required" });
    }

    if (
      !position ||
      typeof position.lat !== "number" ||
      typeof position.long !== "number"
    ) {
      return res
        .status(400)
        .json({ message: "Valid location with 'lat' and 'long' is required" });
    }

    const vendingMachine = await VendingMachine.findByIdAndUpdate(
      id,
      { position: position, location: location },
      { new: true }
    );

    if (!vendingMachine) {
      return res.status(404).json({ message: "Vending machine not found" });
    }

    const vendingMachineData = vendingMachine.toObject();
    vendingMachineData.products = vendingMachineData.products.map((product) => {
      const { buffer, ...rest } = product;
      return rest;
    });

    res.status(200).json({
      message: "Location updated successfully",
      vendingMachine: vendingMachineData,
    });
  } catch (error) {
    console.error("Error updating location:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.addProductsToVendingMachine = async (req, res) => {
  try {
    const { id, products } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Vending machine ID is required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products must be a non-empty array" });
    }

    const vendingMachine = await VendingMachine.findById(id);

    if (!vendingMachine) {
      return res.status(404).json({ message: "Vending machine not found" });
    }

    for (let product of products) {
      const existingProduct = await Product.findById(product.productId);

      if (!existingProduct) {
        return res
          .status(404)
          .json({ message: `Product with ID ${product.productId} not found` });
      }

      product.price = existingProduct.price;
    }
    vendingMachine.products.push(...products);
    await vendingMachine.save();

    res.status(200).json({
      message: "Products added successfully",
      vendingMachine,
    });
  } catch (error) {
    console.error("Error adding products:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.setProductPrices = async (req, res) => {
  try {
    const { id, prices } = req.body;

    if (!id || !prices) {
      return res
        .status(400)
        .json({ message: "Vending machine ID and prices are required" });
    }

    const vendingMachine = await VendingMachine.findById(id);

    if (!vendingMachine) {
      return res.status(404).json({ message: "Vending machine not found" });
    }

    vendingMachine.products = vendingMachine.products.map((product) => {
      if (prices[product.productId]) {
        product.price = prices[product.productId];
      }
      return product;
    });

    await vendingMachine.save();

    const sanitizedProducts = vendingMachine.products.map((product) => ({
      productId: product.productId,
      price: product.price,
      _id: product._id,
    }));

    res.status(200).json({
      message: "Product prices updated successfully",
      products: sanitizedProducts,
    });
  } catch (error) {
    console.error("Error updating product prices:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};
