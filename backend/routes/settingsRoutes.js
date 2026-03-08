const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateEventName,
} = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getSettings);
router.put("/event-name", protect, adminOnly, updateEventName);

module.exports = router;
