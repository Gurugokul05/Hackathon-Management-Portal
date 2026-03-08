#!/usr/bin/env node

/**
 * Test Attendance Lock API Endpoints
 *
 * Tests:
 * 1. GET /api/teams/attendance/lock - Fetch current locks
 * 2. PUT /api/teams/attendance/lock - Update locks (admin only)
 * 3. POST /api/teams/attendance/photo - Submit with lock enforcement
 */

const axios = require("axios");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const API_BASE = "http://localhost:5000/api";
let adminToken = "";
let teamToken = "";
let teamId = "";

const TEST_RESULTS = {
  passed: 0,
  failed: 0,
  errors: [],
};

async function log(message, type = "info") {
  const prefix =
    {
      info: "[INFO]",
      success: "[✓ PASS]",
      error: "[✗ FAIL]",
      warn: "[WARN]",
    }[type] || "[INFO]";

}

async function checkServerRunning() {
  return new Promise((resolve) => {
    const req = http.get("http://localhost:5000/", (res) => {
      req.abort();
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.abort();
      resolve(false);
    });
  });
}

async function testAttendanceLockAPI() {


  // Check if server is running
  const isRunning = await checkServerRunning();
  if (!isRunning) {
    await log("Backend server is not running on localhost:5000", "error");
    await log("Please start the backend with: npm start", "info");
    process.exit(1);
  }

  await log("Backend server detected", "success");

  try {
    // Test 1: Admin Login

    try {
      const res = await axios.post(`${API_BASE}/auth/login-admin`, {
        username: "admin",
        password: "admin123",
      });
      adminToken = res.data.token;
      await log("Admin login successful", "success");
      TEST_RESULTS.passed++;
    } catch (err) {
      await log(
        `Admin login failed: ${err.response?.data?.message || err.message}`,
        "error",
      );
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
      process.exit(1);
    }

    // Test 2: Get Attendance Locks

    try {
      const res = await axios.get(`${API_BASE}/teams/attendance/lock`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      await log("Fetched current attendance locks", "success");
      TEST_RESULTS.passed++;
    } catch (err) {
      await log(`Failed to fetch locks: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 3: Update Lock (Open Round 2)

    try {
      const res = await axios.put(
        `${API_BASE}/teams/attendance/lock`,
        { round: "round2", open: true },
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );


      await log("Successfully unlocked round 2", "success");
      TEST_RESULTS.passed++;
    } catch (err) {
      await log(
        `Failed to update lock: ${err.response?.data?.message || err.message}`,
        "error",
      );
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 4: Verify Lock State (Round 2 should be open)

    try {
      const res = await axios.get(`${API_BASE}/teams/attendance/lock`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.data.locks.round2 === true) {

        await log("Round 2 is correctly unlocked", "success");
        TEST_RESULTS.passed++;
      } else {
        await log("Round 2 lock state is not as expected", "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Failed to verify lock state: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 5: Lock Round 2 (Admin Close)

    try {
      const res = await axios.put(
        `${API_BASE}/teams/attendance/lock`,
        { round: "round2", open: false },
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );


      await log("Successfully locked round 2", "success");
      TEST_RESULTS.passed++;
    } catch (err) {
      await log(
        `Failed to lock round 2: ${err.response?.data?.message || err.message}`,
        "error",
      );
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 6: Invalid Round

    try {
      await axios.put(
        `${API_BASE}/teams/attendance/lock`,
        { round: "round99", open: true },
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );
      await log("Should have rejected invalid round", "error");
      TEST_RESULTS.failed++;
    } catch (err) {
      if (err.response?.status === 400) {

        await log("Correctly rejected invalid round", "success");
        TEST_RESULTS.passed++;
      } else {
        await log(`Unexpected error: ${err.message}`, "error");
        TEST_RESULTS.failed++;
      }
    }

    // Test 7: Unauthorized Access

    try {
      await axios.put(`${API_BASE}/teams/attendance/lock`, {
        round: "round1",
        open: true,
      });
      await log("Should have rejected unauthorized access", "error");
      TEST_RESULTS.failed++;
    } catch (err) {
      if (err.response?.status === 401) {
        await log("Correctly rejected unauthorized access", "success");
        TEST_RESULTS.passed++;
      } else {
        await log(`Unexpected error: ${err.message}`, "error");
        TEST_RESULTS.failed++;
      }
    }

    // Print summary




    if (TEST_RESULTS.errors.length > 0) {

      TEST_RESULTS.errors.forEach((err, idx) => {

      });
    }

    if (TEST_RESULTS.failed === 0) {

      process.exit(0);
    } else {

      process.exit(1);
    }
  } catch (error) {

    process.exit(1);
  }
}

// Run tests
testAttendanceLockAPI();
