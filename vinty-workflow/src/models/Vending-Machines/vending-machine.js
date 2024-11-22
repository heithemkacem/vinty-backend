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
      required: function () { return !this.alwaysOpen; } // Required if not always open
    },
    end: {
      type: String, 
      required: function () { return !this.alwaysOpen; } // Required if not always open
    }
  },
  alwaysOpen: {
    type: Boolean,
    default: false // If true, machine is always open
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
  },
  paymentMethods: {
    type: [String], 
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Mobile Payment'],
    default: ['Cash']
  }
}, { timestamps: true });

module.exports = mongoose.model('VendingMachine', vendingMachineSchema);
