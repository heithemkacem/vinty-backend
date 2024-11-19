// models/VendingMachine.js
const mongoose = require('mongoose');

const vendingMachineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  open: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: []
  },
  position: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendingMachineOwner',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('VendingMachine', vendingMachineSchema);
