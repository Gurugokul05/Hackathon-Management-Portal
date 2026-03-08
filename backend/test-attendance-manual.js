#!/usr/bin/env node

/**
 * Manual Attendance Lock API Test
 * Tests the lock endpoints by making HTTP requests
 */

const http = require("http");

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

function makeRequest(method, path, data = null, authToken = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (authToken) {
      options.headers.Authorization = `Bearer ${authToken}`;
    }

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers,
          });
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.abort();
      reject(new Error("Request timeout"));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAttendanceLockAPI() {
  let adminToken = "";

  try {
    // Test 1: Admin Login
    try {
      const res = await makeRequest("POST", "/api/auth/login-admin", {
        username: "admin",
        password: "admin123",
      });

      if (res.status === 200 && res.data.token) {
        adminToken = res.data.token;
        await log("Admin login successful", "success");
        TEST_RESULTS.passed++;
      } else {
        await log(`Admin login failed with status ${res.status}`, "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Admin login error: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
      process.exit(1);
    }

    // Test 2: Get Current Locks
    try {
      const res = await makeRequest(
        "GET",
        "/api/teams/attendance/lock",
        null,
        adminToken,
      );

      if (res.status === 200 && res.data.locks) {
        await log("Successfully fetched locks", "success");
        TEST_RESULTS.passed++;
      } else {
        await log(`Failed with status ${res.status}`, "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Error: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 3: Open Round 2
    try {
      const res = await makeRequest(
        "PUT",
        "/api/teams/attendance/lock",
        { round: "round2", open: true },
        adminToken,
      );

      if (res.status === 200) {
        await log("Successfully unlocked round 2", "success");
        TEST_RESULTS.passed++;
      } else {
        await log(`Failed with status ${res.status}`, "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Error: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 4: Verify Round 2 is Open
    try {
      const res = await makeRequest(
        "GET",
        "/api/teams/attendance/lock",
        null,
        adminToken,
      );

      if (res.status === 200 && res.data.locks.round2 === true) {
        await log("Round 2 is correctly unlocked", "success");
        TEST_RESULTS.passed++;
      } else {
        await log("Round 2 lock state is not as expected", "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Error: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 5: Close Round 2
    try {
      const res = await makeRequest(
        "PUT",
        "/api/teams/attendance/lock",
        { round: "round2", open: false },
        adminToken,
      );

      if (res.status === 200) {
        await log("Successfully locked round 2", "success");
        TEST_RESULTS.passed++;
      } else {
        await log(`Failed with status ${res.status}`, "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Error: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 6: Invalid Round
    try {
      const res = await makeRequest(
        "PUT",
        "/api/teams/attendance/lock",
        { round: "invalid_round", open: true },
        adminToken,
      );

      if (res.status === 400) {
        await log("Correctly rejected invalid round", "success");
        TEST_RESULTS.passed++;
      } else {
        await log(`Should have returned 400, got ${res.status}`, "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Error: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 7: No Auth
    try {
      const res = await makeRequest("GET", "/api/teams/attendance/lock");

      if (res.status === 401) {
        await log("Correctly rejected unauthorized access", "success");
        TEST_RESULTS.passed++;
      } else {
        await log(`Should have returned 401, got ${res.status}`, "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Error: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Summary
    if (TEST_RESULTS.failed === 0) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    process.exit(1);
  }
}

testAttendanceLockAPI();
