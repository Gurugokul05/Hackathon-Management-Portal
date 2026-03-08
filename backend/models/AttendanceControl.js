const mongoose = require("mongoose");

const attendanceControlSchema = new mongoose.Schema({
  scope: { type: String, default: "global", unique: true },
  totalRounds: { type: Number, default: 3 },
  locks: {
    round1: { type: Boolean, default: true },
    round2: { type: Boolean, default: false },
    round3: { type: Boolean, default: false },
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AttendanceControl", attendanceControlSchema);
