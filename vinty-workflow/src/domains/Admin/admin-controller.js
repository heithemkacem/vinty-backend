const {Admin} = require("../../models");
const {Profile} = require("../../models");
const {VendingMachineOwner} = require("../../models");

exports.createAdmin = async (req, res) => {
  try {
    const profileData = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      role: "admin",
    };

    const profile = new Profile(profileData);
    await profile.save();

    const adminData = {
      profileId: profile._id,
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      accessLevel: req.body.accessLevel || "moderator",
    };

    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin,
      profile: profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllOwnersWithVendingMachineCount = async (req, res) => {
  try {
    const owners = await VendingMachineOwner.aggregate([
      {
        $lookup: {
          from: "vendingmachines",
          localField: "vendingMachines",
          foreignField: "_id",
          as: "vendingMachineDetails",
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          vendingMachineCount: { $size: "$vendingMachineDetails" },
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      owners,
    });
  } catch (error) {
    console.error("Error fetching owners:", error.message);
    res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
};
exports.searchOwnerByNameOrEmail = async (req, res) => {
  const { query } = req.query;
  const { adminId } = req.params;
  if (!query) {
    return res
      .status(400)
      .json({ ok: false, message: "Query parameter is required" });
  }

  try {
    const owners = await VendingMachineOwner.find({
      $or: [
        { fullName: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
      ],
    }).select("fullName email vendingMachines");

    if (owners.length > 0) {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({ ok: false, message: "Admin not found" });
      }

      if (!admin.searchList.includes(query)) {
        admin.searchList.push(query);
        await admin.save();
      }
    }

    res.status(200).json({ ok: true, owners });
  } catch (error) {
    console.error("Error searching for owners:", error.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.viewAdminSearchList = async (req, res) => {
  const { adminId } = req.params;
  if (!adminId) {
    return res.status(400).json({ ok: false, message: "Admin ID is required" });
  }

  try {
    const admin = await Admin.findById(adminId).select("searchList");
    if (!admin) {
      return res.status(404).json({ ok: false, message: "Admin not found" });
    }

    res.status(200).json({ ok: true, searchList: admin.searchList });
  } catch (error) {
    console.error("Error fetching search list:", error.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.deleteAdminSearchListItem = async (req, res) => {
  const { adminId } = req.params;
  const { item } = req.body;

  if (!adminId || !item) {
    return res
      .status(400)
      .json({ ok: false, message: "Admin ID and search item are required" });
  }

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ ok: false, message: "Admin not found" });
    }
    admin.searchList = admin.searchList.filter(
      (searchItem) => searchItem !== item
    );
    await admin.save();

    res.status(200).json({
      ok: true,
      message: "Search item deleted successfully",
      searchList: admin.searchList,
    });
  } catch (error) {
    console.error("Error deleting search item:", error.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.clearAdminSearchList = async (req, res) => {
  const { adminId } = req.params;

  if (!adminId) {
    return res.status(400).json({ ok: false, message: "Admin ID is required" });
  }

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ ok: false, message: "Admin not found" });
    }

    admin.searchList = [];
    await admin.save();

    res.status(200).json({
      ok: true,
      message: "Search list cleared successfully",
      searchList: admin.searchList,
    });
  } catch (error) {
    console.error("Error clearing search list:", error.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};
exports.deleteVendingMachineOwner = async (req, res) => {
  const { ownerId } = req.params; // ID of the owner to delete

  if (!ownerId) {
    return res.status(400).json({ ok: false, message: "Owner ID is required" });
  }

  try {
    // Check if the owner exists
    const owner = await VendingMachineOwner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ ok: false, message: "Owner not found" });
    }

    await owner.remove();

    res.status(200).json({
      ok: true,
      message: "Vending vending-machine-owner deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting vending vending-machine-owner:",
      error.message
    );
    res.status(500).json({ ok: false, message: "Server error" });
  }
};
exports.updateVendingMachineOwner = async (req, res) => {
  const { ownerId } = req.params; // ID of the owner to update
  const { fullName, email, vendingMachines } = req.body; // Fields to update

  if (!ownerId) {
    return res.status(400).json({ ok: false, message: "Owner ID is required" });
  }

  try {
    // Find the owner by ID
    const owner = await VendingMachineOwner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ ok: false, message: "Owner not found" });
    }

    // Update fields if provided
    if (fullName) owner.fullName = fullName;
    if (email) owner.email = email;
    if (vendingMachines) owner.vendingMachines = vendingMachines;

    // Save the updated owner
    await owner.save();

    res.status(200).json({
      ok: true,
      message: "Vending vending-machine-owner updated successfully",
      owner,
    });
  } catch (error) {
    console.error(
      "Error updating vending vending-machine-owner:",
      error.message
    );
    res.status(500).json({ ok: false, message: "Server error" });
  }
};
