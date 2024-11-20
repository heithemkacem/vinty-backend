const  {Category}  = require("../../models/index");
const { createErrorResponse } = require("../../Utils/Error-handle");
exports.createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
  

    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('subCategories')
      .lean();

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    const categoriesData = categories.map((category) => ({
      title: category.title,
      subCategories: category.subCategories.map((subCategory) => ({
        id: subCategory._id,
        title: subCategory.title,
        image: subCategory.imageUrl,
        bgColor: subCategory.bgColor,
        borderColor: subCategory.borderColor,
        blur: subCategory.blur || false,
      })),
    }));

    res.status(200).json(categoriesData);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};



exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json(createErrorResponse("Category not found", 404));
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res
        .status(404)
        .json(createErrorResponse("Category not found", 404));
    }
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json(createErrorResponse("Category not found", 404));
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    if (!["normal", "exclusive"].includes(type)) {
      return res
        .status(400)
        .json(createErrorResponse("Invalid category type", 400));
    }

    const categories = await Category.find({ type })
      .populate('subCategories')
      .lean()
    if (!categories || categories.length === 0) {
      return res.status(404).json(createErrorResponse("No categories found", 404));
    }

    const categoriesData = categories.map((category) => ({
      title: category.title,
      subCategories: category.subCategories.map((subCategory) => ({
        id: subCategory._id,
        title: subCategory.title,
        image: subCategory.imageUrl,
        bgColor: subCategory.bgColor,
        borderColor: subCategory.borderColor,
        blur: subCategory.blur || false,
      })),
    }));

    res.status(200).json(categoriesData);
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.getCategoriesBothTypes = async (req, res) => {
  try {
    const normalCategories = await Category.find({ type: 'normal' })
      .populate('subCategories')
      .limit(5)  
      .lean();

    const exclusiveCategories = await Category.find({ type: 'exclusive' })
      .populate('subCategories')
      .limit(5) 
      .lean();

    const categoriesData = {
      "Normal Categories": normalCategories.map((category) => ({
        title: category.title,
        subCategories: category.subCategories.slice(0, 5).map((subCategory) => ({ 
          id: subCategory._id,
          title: subCategory.title,
          image: subCategory.imageUrl,
          bgColor: subCategory.bgColor,
          borderColor: subCategory.borderColor,
          blur: subCategory.blur || false,
        })),
      })),
      "Exclusive Categories": exclusiveCategories.map((category) => ({
        title: category.title,
        subCategories: category.subCategories.slice(0, 5).map((subCategory) => ({ // Limit to 5 subcategories
          id: subCategory._id,
          title: subCategory.title,
          image: subCategory.imageUrl,
          bgColor: subCategory.bgColor,
          borderColor: subCategory.borderColor,
          blur: subCategory.blur || false,
        })),
      })),
    };

    res.status(200).json(categoriesData);
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};
