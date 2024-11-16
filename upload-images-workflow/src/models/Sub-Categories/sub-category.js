  // models/SubCategory.js
  const mongoose = require('mongoose');

  const subCategorySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String,
      required: true, 
    },
    borderColor: {
      type: String,
      required: true,
    },
    blur: {
      type: Boolean, 
    },
    imageUrl: {
      type: String,
      required: true, 
    },
    type: {
      type: String,
      enum: ['exclusive', 'normal'],
      required: true,
    },
  }, { timestamps: true });

  module.exports = mongoose.model.SubCategory || mongoose.model('SubCategory', subCategorySchema);
