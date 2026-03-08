const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

exports.listAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (e) {
    res.status(500).json({ message: "Failed to list admins" });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { username, password, role = "staff", permissions = [] } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and password required" });
    const exists = await Admin.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "username already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      username,
      password: hashed,
      role,
      permissions,
    });
    res
      .status(201)
      .json({
        _id: admin._id,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions,
      });
  } catch (e) {
    res.status(500).json({ message: "Failed to create admin" });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role, permissions } = req.body;
    const update = {};
    if (username) update.username = username;
    if (role) update.role = role;
    if (Array.isArray(permissions)) update.permissions = permissions;
    if (password) update.password = await bcrypt.hash(password, 10);
    const admin = await Admin.findByIdAndUpdate(id, update, { new: true });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({
      _id: admin._id,
      username: admin.username,
      role: admin.role,
      permissions: admin.permissions,
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to update admin" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    // Prevent deleting the last full admin
    if (admin.role === "admin") {
      const adminCount = await Admin.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res
          .status(400)
          .json({ message: "Cannot delete the last admin" });
      }
    }
    await Admin.findByIdAndDelete(id);
    res.json({ message: "Admin deleted" });
  } catch (e) {
    res.status(500).json({ message: "Failed to delete admin" });
  }
};
