const  {Category}  = require("../../models/index");
const { createErrorResponse } = require("../../Utils/Error-handle");
exports.createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    console.log(req.body);

    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
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

    const categories = await Category.find({ type });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};
