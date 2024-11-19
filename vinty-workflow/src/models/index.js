const Admin = require("./Admin/admin");
const Category = require("./Categories/categorie");
const Otp = require('./OTP/otp');
const Client = require('./Client/client');
const Product = require('./Products/product'); 
const Profile = require('./Profile/profile');
const SubCategory = require('./Sub-Categories/sub-category');
const VendingMachine = require('./Vending-Machines/vending-machine');
const VendingMachineOwner = require('./Vending-Machine-Owner/vending-machine-owner');
 

module.exports = {
  Admin,
  Otp,
  Client,
  Product,
  Profile,
  SubCategory,
  VendingMachine,
  VendingMachineOwner,
  Category
};
