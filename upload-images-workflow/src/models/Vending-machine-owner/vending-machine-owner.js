// models/VendingMachineOwner.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendingMachineOwnerSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  vendingMachines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendingMachine'
    }
  ]
}, { timestamps: true });

// Hash the password before saving
vendingMachineOwnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('VendingMachineOwner', vendingMachineOwnerSchema);
