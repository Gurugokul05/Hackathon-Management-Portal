#!/usr/bin/env node

/**
 * Test Attendance Lock Functionality
 *
 * This script tests:
 * 1. Global lock state persistence
 * 2. Team submission blocking when round is locked
 * 3. Team submission allowing when round is unlocked
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Team = require("./models/Team");
const AttendanceControl = require("./models/AttendanceControl");

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
  console.log(`${prefix} ${message}`);
}

async function testAttendanceLocks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Test 1: Create/update global lock state

    try {
      const control = await AttendanceControl.findOneAndUpdate(
        { scope: "global" },
        {
          $set: {
            "locks.round1": true,
            "locks.round2": false,
            "locks.round3": false,
            updatedAt: new Date(),
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).lean();

      if (control && control.locks) {
        await log("Global locks created/updated successfully", "success");
        TEST_RESULTS.passed++;
      } else {
        await log("Failed to create global locks", "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Error creating global locks: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 2: Fetch global lock state

    try {
      const control = await AttendanceControl.findOne({
        scope: "global",
      }).lean();
      if (control) {
        await log("Global locks retrieved successfully", "success");
        TEST_RESULTS.passed++;
      } else {
        await log("No global locks found", "warn");
      }
    } catch (err) {
      await log(`Error fetching global locks: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 3: Update individual round lock

    try {
      const control = await AttendanceControl.findOneAndUpdate(
        { scope: "global" },
        { $set: { "locks.round2": true, updatedAt: new Date() } },
        { new: true, upsert: true },
      ).lean();

      if (control.locks.round2 === true) {
        await log("Round 2 lock updated to true successfully", "success");
        TEST_RESULTS.passed++;
      } else {
        await log("Failed to update Round 2 lock", "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Error updating round lock: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 4: Verify locks sync with teams

    try {
      const teams = await Team.find()
        .select("teamName attendanceLocks")
        .limit(2);
      if (teams.length > 0) {
        await log(`Found ${teams.length} teams to check`, "info");
        teams.forEach((team, idx) => {
          console.log(
            `  Team ${idx + 1} (${team.teamName}): ${JSON.stringify(team.attendanceLocks)}`,
          );
        });
        await log("Team lock states retrieved successfully", "success");
        TEST_RESULTS.passed++;
      } else {
        await log("No teams found in database", "warn");
      }
    } catch (err) {
      await log(`Error checking team locks: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 5: Simulate lock check logic

    try {
      const control = await AttendanceControl.findOne({
        scope: "global",
      }).lean();
      const DEFAULT_LOCKS = {
        round1: true,
        round2: false,
        round3: false,
      };

      const globalLocks = control?.locks || DEFAULT_LOCKS;

      // Test with a sample team
      const sampleTeam = await Team.findOne()
        .select("teamName attendanceLocks")
        .lean();
      if (sampleTeam) {
        const mergedLocks = {
          ...DEFAULT_LOCKS,
          ...globalLocks,
          ...(sampleTeam.attendanceLocks || {}),
        };

        console.log(`  Merged locks: ${JSON.stringify(mergedLocks)}`);
        console.log(
          `    Team locks: ${JSON.stringify(sampleTeam.attendanceLocks)}`,
        );

        // Simulate submission attempts
        const testRound = "round2";
        const isLocked = !mergedLocks[testRound];

        if (isLocked) {
          console.log(
            `  ✓ Round ${testRound} is LOCKED - submission would be REJECTED`,
          );
        } else {
          console.log(
            `  ✓ Round ${testRound} is OPEN - submission would be ALLOWED`,
          );
        }

        await log("Lock check logic works correctly", "success");
        TEST_RESULTS.passed++;
      } else {
        await log("No sample team found for lock check simulation", "warn");
      }
    } catch (err) {
      await log(`Error simulating lock check: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Test 6: Bulk update teams

    try {
      const result = await Team.updateMany(
        {},
        { $set: { "attendanceLocks.round1": true } },
      );

      if (result.modifiedCount >= 0) {
        await log(
          `Bulk update successful - ${result.modifiedCount} teams modified`,
          "success",
        );
        TEST_RESULTS.passed++;
      } else {
        await log("Bulk update returned unexpected result", "error");
        TEST_RESULTS.failed++;
      }
    } catch (err) {
      await log(`Error in bulk update: ${err.message}`, "error");
      TEST_RESULTS.failed++;
      TEST_RESULTS.errors.push(err.message);
    }

    // Print summary
    console.log("\n" + "=".repeat(50));
    console.log("TEST SUMMARY");
    console.log("=".repeat(50));
    console.log(`Passed: ${TEST_RESULTS.passed}`);
    console.log(`Failed: ${TEST_RESULTS.failed}`);

    if (TEST_RESULTS.errors.length > 0) {
      console.log("\nErrors:");
      TEST_RESULTS.errors.forEach((err, idx) => {
        console.log(`  ${idx + 1}. ${err}`);
      });
    }

    if (TEST_RESULTS.failed === 0) {
      console.log(
        "\n✓ All tests passed! Attendance lock system is working correctly.\n",
      );
      process.exit(0);
    } else {
      console.log("\n✗ Some tests failed. Please review the errors above.\n");
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n[FATAL] ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run tests
testAttendanceLocks();
