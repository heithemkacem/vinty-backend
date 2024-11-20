// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    required: true,
  },
  radiusColor: {
    type: String,
    required: true,
  },
  blur: {
    type: Boolean,
    default: false,
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
  subCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
  ],
}, { timestamps: true });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
