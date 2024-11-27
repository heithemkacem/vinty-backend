const mongoose = require("mongoose");

const vendingMachineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    description:{
      type:String
    },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    openDays: {
      type: [String], 
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      default: [],
    },
    openHours: {
      start: {
        type: String,
        required: function () {
          return !this.alwaysOpen;
        },
      },
      end: {
        type: String,
        required: function () {
          return !this.alwaysOpen;
        },
      },
    },
    alwaysOpen: {
      type: Boolean,
      default: false,
    },
    position: {
      lat: { type: Number },
      long: { type: Number },
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        price: { type: Number },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendingMachineOwner",
      required: true,
    },
    paymentMethods: {
      type: [String],
      enum: ["Cash", "Card", "Both"],
      default: ["Cash"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendingMachine", vendingMachineSchema);
