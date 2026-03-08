#!/usr/bin/env node

/**
 * Reset Admin Password
 * Run: node reset-admin-password.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Admin = require("./models/Admin");

// New credentials from .env file
const NEW_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

async function resetPassword() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB\n");

    // Find admin
    const admin = await Admin.findOne({ username: NEW_CREDENTIALS.username });

    if (!admin) {
      console.log(`✗ Admin user '${NEW_CREDENTIALS.username}' not found.`);
      console.log("Run create-admin.js to create a new admin.\n");
      process.exit(1);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(NEW_CREDENTIALS.password, 10);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    console.log("✓ Password reset successfully!\n");
    console.log("=".repeat(50));
    console.log("ADMIN LOGIN CREDENTIALS");
    console.log("=".repeat(50));
    console.log(`Username: ${NEW_CREDENTIALS.username}`);
    console.log(`Password: ${NEW_CREDENTIALS.password}`);
    console.log("=".repeat(50));
    console.log("\n⚠ IMPORTANT: Change this password after login!\n");

    process.exit(0);
  } catch (error) {
    console.error("✗ Error resetting password:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

resetPassword();
