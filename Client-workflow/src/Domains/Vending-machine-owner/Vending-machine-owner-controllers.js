// controllers/vendingMachineOwnerController.js

const VendingMachineOwner = require('../../Models/Vending-machine-owner/Vending-machine-owner');
const Product = require('../../Models/Products/Products')
const VendingMachine = require('../../Models/Vending-Machines/Vending-machines')
const createErrorResponse = require('../../Utils/Error-handle');
const Category = require('../../Models/Categories/Categories')
const SubCategory= require('../../Models/Sub-Categories/subCategories')


exports.getVendingMachinesByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

  
    const vendingMachines = await VendingMachine.find({ owner: ownerId });

    if (!vendingMachines.length) {
      return res.status(404).json({ message: 'No vending machines found for this owner' });
    }

    res.status(200).json({ message: 'Vending machines retrieved successfully', vendingMachines });
  } catch (error) {
    console.error('Error retrieving vending machines:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, subName, price, image, categoryId, subCategoryId, vendingMachineId } = req.body;

    // Check if the required fields are provided
    if (!name || !subName || !price || !image || !categoryId || !vendingMachineId) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Create a new product, associating it with a category and optionally a subcategory
    const newProduct = new Product({
      name,
      subName,
      price,
      image,
      category: categoryId, 
      subCategory: subCategoryId || null, 
    });

    await newProduct.save();
    const vendingMachine = await VendingMachine.findById(vendingMachineId);
    if (!vendingMachine) {
      return res.status(404).json({ message: 'Vending Machine not found' });
    }

    vendingMachine.products.push(newProduct._id);
    await vendingMachine.save();

    res.status(201).json({
      message: 'Product created and added to vending machine successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.removeProductFromVendingMachine = async (req, res) => {
  try {
    const { vendingMachineId, productId } = req.params;
    const vendingMachine = await VendingMachine.findById(vendingMachineId);
    if (!vendingMachine) {
      return res.status(404).json({ message: 'Vending Machine not found' });
    }
    const productIndex = vendingMachine.products.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in this vending machine' });
    }
    vendingMachine.products.splice(productIndex, 1);
    await vendingMachine.save();
    await Product.findByIdAndRemove(productId);

    res.status(200).json({ message: 'Product removed from vending machine successfully' });
  } catch (error) {
    console.error('Error removing product from vending machine:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.createSubCategoryAndAddToVendingMachine = async (req, res) => {
  try {
    const { vendingMachineId, title, categoryId, bgColor, borderColor, blur, imageUrl, type } = req.body; 

    // Find the vending machine by ID
    const vendingMachine = await VendingMachine.findById(vendingMachineId);
    if (!vendingMachine) {
      return res.status(404).json({ message: 'Vending machine not found' });
    }

    // Create the subcategory using the data sent in the request body
    const newSubCategory = new SubCategory({
      title,
      categoryId,
      bgColor,
      borderColor,
      blur,
      imageUrl,
      type
    });

   
    await newSubCategory.save();

    
    vendingMachine.subCategories.push(newSubCategory._id);

    
    await vendingMachine.save();

    res.status(200).json({ message: 'Subcategory created and added to vending machine successfully', newSubCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.createCategoryAndAddToVendingMachine = async (req, res) => {
  try {
    const { vendingMachineId, title, bgColor, radiusColor, blur, imageUrl, type } = req.body; 

    // Find the vending machine by ID
    const vendingMachine = await VendingMachine.findById(vendingMachineId);
    if (!vendingMachine) {
      return res.status(404).json({ message: 'Vending machine not found' });
    }

    // Create the category using the data sent in the request body
    const newCategory = new Category({
      title,
      bgColor,
      radiusColor,
      blur,
      imageUrl,
      type
    });


    await newCategory.save();
    vendingMachine.categories.push(newCategory._id);

    await vendingMachine.save();

    res.status(200).json({ message: 'Category created and added to vending machine successfully', newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};