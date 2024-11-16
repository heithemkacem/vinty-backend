const Admin = require("./Admin/admin");
const Categories = require("./Categories/categorie");
const Otp = require('./OTP/otp')
const Client = require('./Client/client')
const Product = require('./Client/client')
const Profile = require('./Profile/profile')
const SubCategory = require('./Sub-Categories/sub-category')
const VendingMachine = require('./Vending-Machines/vending-machine')
const VendingMachineOwner = require('./Vending-machine-owner/vending-machine-owner')
module.exports = {
  Admin,
  Categories,
  Otp,
  Client,
  Product,
  Profile,
  SubCategory,
  VendingMachine,
  VendingMachineOwner
};
