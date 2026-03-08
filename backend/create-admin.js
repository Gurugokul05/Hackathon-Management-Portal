#!/usr/bin/env node

/**
 * Create Default Admin User
 * Run: node create-admin.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Admin = require("./models/Admin");

const DEFAULT_ADMIN = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
  role: "admin",
  permissions: [],
};

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB\n");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      username: DEFAULT_ADMIN.username,
    });

    if (existingAdmin) {
      console.log("⚠ Admin already exists:");
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(
        "\nIf you forgot the password, delete this admin from MongoDB and run this script again.",
      );
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

    // Create admin
    const admin = await Admin.create({
      username: DEFAULT_ADMIN.username,
      password: hashedPassword,
      role: DEFAULT_ADMIN.role,
      permissions: DEFAULT_ADMIN.permissions,
    });

    console.log("✓ Admin user created successfully!\n");
    console.log("=".repeat(50));
    console.log("ADMIN LOGIN CREDENTIALS");
    console.log("=".repeat(50));
    console.log(`Username: ${DEFAULT_ADMIN.username}`);
    console.log(`Password: ${DEFAULT_ADMIN.password}`);
    console.log("=".repeat(50));
    console.log("\n⚠ IMPORTANT: Change this password after first login!\n");

    process.exit(0);
  } catch (error) {
    console.error("✗ Error creating admin:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
