// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  image: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    }
  ],
  subCategories: [  
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: false,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
