
const {SubCategory} = require('../../models/index');
const { createErrorResponse } = require('../../Utils/Error-handle'); 


exports.createSubCategory = async (req, res) => {
  try {
    const newSubCategory = new SubCategory(req.body);
    await newSubCategory.save();
    res.status(201).json({ message: 'SubCategory created successfully', subCategory: newSubCategory });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};


exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find();
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};


exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json(createErrorResponse('SubCategory not found', 404));
    }
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};


exports.updateSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subCategory) {
      return res.status(404).json(createErrorResponse('SubCategory not found', 404));
    }
    res.status(200).json({ message: 'SubCategory updated successfully', subCategory });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};


exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(404).json(createErrorResponse('SubCategory not found', 404));
    }
    res.status(200).json({ message: 'SubCategory deleted successfully' });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};
exports.getSubCategoriesByCategoryId = async (req, res) => {
    try {
      const subCategories = await SubCategory.find({ categoryId: req.params.categoryId })
        .populate('categoryId', 'title bgColor radiusColor blur imageUrl type');
  
      if (!subCategories.length) {
        return res.status(404).json(createErrorResponse('No subcategories found for this category', 404));
      }
  
      res.status(200).json(subCategories);
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', 500));
    }
  };
  
  exports.getSubCategoriesByType = async (req, res) => {
    try {
      const { type } = req.params;
      if (!["normal", "exclusive"].includes(type)) {
        return res.status(400).json(createErrorResponse("Invalid subcategory type", 400));
      }
  
      const subCategories = await SubCategory.find({ type });
      res.status(200).json(subCategories);
    } catch (error) {
      res.status(500).json(createErrorResponse("Server error", 500));
    }
  };
  