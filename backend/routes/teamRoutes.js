const express = require("express");
const router = express.Router();
const {
  getAllTeams,
  updateMemberAttendance,
  updateMarks,
  getLeaderboard,
  updateAttendanceLock,
  getAttendanceLocks,
  addAttendanceRound,
  getTotalRounds,
  deleteAttendanceRound,
} = require("../controllers/teamController");
const {
  protect,
  adminOnly,
  adminOrPermission,
  adminOrAnyPermission,
} = require("../middleware/authMiddleware");
const { cacheMiddleware } = require("../middleware/cacheMiddleware");

router.get("/leaderboard", cacheMiddleware(60), getLeaderboard); // Cache for 60 seconds
router.get(
  "/attendance/lock",
  protect,
  cacheMiddleware(120),
  getAttendanceLocks,
); // Cache for 2 minutes
router.get("/attendance/rounds", protect, cacheMiddleware(300), getTotalRounds); // Cache for 5 minutes
router.get(
  "/",
  protect,
  adminOrAnyPermission("attendance:update", "marks:update"),
  getAllTeams,
);
router.post(
  "/attendance/add-round",
  protect,
  adminOrPermission("attendance:update"),
  addAttendanceRound,
);
router.delete(
  "/attendance/round/:roundName",
  protect,
  adminOrPermission("attendance:update"),
  deleteAttendanceRound,
);
router.put(
  "/:id/attendance/member",
  protect,
  adminOrPermission("attendance:update"),
  updateMemberAttendance,
);
router.post(
  "/attendance/photo",
  protect,
  require("../controllers/teamController").submitAttendancePhoto,
);
router.put(
  "/:id/attendance/verify",
  protect,
  adminOrPermission("attendance:update"),
  require("../controllers/teamController").verifyAttendancePhoto,
);
router.put(
  "/attendance/lock",
  protect,
  adminOrPermission("attendance:update"),
  updateAttendanceLock,
);
router.put(
  "/:id/marks",
  protect,
  adminOrPermission("marks:update"),
  updateMarks,
);

module.exports = router;
