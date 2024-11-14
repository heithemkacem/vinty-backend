const Admin = require('../../Models/Admin/Admin');
const Profile = require('../../Models/Profile/Profile');

exports.createAdmin = async (req, res) => {
  try {

    const profileData = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      role: 'admin'
    };

    const profile = new Profile(profileData);
    await profile.save();

    
    const adminData = {
      profileId: profile._id,
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      accessLevel: req.body.accessLevel || 'moderator' 
    };

    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    res.status(201).json({
      message: 'Admin created successfully',
      admin: newAdmin,
      profile: profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
