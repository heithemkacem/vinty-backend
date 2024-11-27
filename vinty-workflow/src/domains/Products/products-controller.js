// controllers/productController.js
const {Product} = require('../../models');
const {VendingMachine} = require('../../models');
const { createErrorResponse } = require('../../Utils/Error-handle'); 
const {Category} = require('../../models')

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1 } = req.query; 
    const limit = 6;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate('categories') 
      .populate('subCategories') 
      .skip(skip)
      .limit(limit);
      
    const totalProducts = await Product.countDocuments(); 
    const totalPages = Math.ceil(totalProducts / limit); 

    res.status(200).json({
      products,
      currentPage: parseInt(page, 10),
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ ok: false, status: 500, message: 'Server error' });
  }
};



// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json(createErrorResponse('Product not found', 404));
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json(createErrorResponse('Product not found', 404));
    }
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json(createErrorResponse('Product not found', 404));
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};
exports.getProductsByVendingMachineId = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Vending machine ID is required" });
    }

    const vendingMachine = await VendingMachine.findById(id).populate('products.productId', 'name subName price image');

    if (!vendingMachine) {
      return res.status(404).json({ message: "Vending machine not found" });
    }

    res.status(200).json({
      message: "Products retrieved successfully",
      products: vendingMachine.products,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
  };
  exports.getProductsForCategory = async (req, res) => {
    try {
      const { categoryId } = req.body;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      const products = await Product.find({ categories: categoryId })
        .populate({
          path: 'categories', 
        })
        .populate({
          path: 'subCategories', 
        });
  
      res.status(200).json(products);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ ok: false, status: 500, message: 'Server error' });
    }
  };
  


exports.searchProductsByName = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Invalid query. Please provide a valid string.' });
    }

    // Perform a case-insensitive search
    const products = await Product.find({ 
      name: { $regex: query, $options: 'i' } 
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found matching the query.' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while searching for products.' });
  }
};

