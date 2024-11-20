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
  openDays: {
    type: [String], // Array of days
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: []
  },
  openHours: {
    start: {
      type: String, 
      required: true
    },
    end: {
      type: String, 
      required: true
    }
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
