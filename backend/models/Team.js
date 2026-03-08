const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Not Captured", "Pending", "Verified", "Rejected"],
      default: "Not Captured",
    },
    photo: { type: String, default: null }, // Base64
    submittedAt: { type: Date, default: null },
  },
  { _id: false },
);

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  department: { type: String, required: true },
  section: { type: String, required: true },
  year: { type: String, required: true },
  round1: { type: roundSchema, default: () => ({}) },
  round2: { type: roundSchema, default: () => ({}) },
  round3: { type: roundSchema, default: () => ({}) },
  marks: {
    round1: { type: Number, default: 0 },
    round2: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
});

const teamSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true },
  teamName: { type: String, required: true },
  attendanceLocks: {
    round1: { type: Boolean, default: true },
    round2: { type: Boolean, default: false },
    round3: { type: Boolean, default: false },
  },
  leader: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    department: { type: String, required: true },
    section: { type: String, required: true },
    year: { type: String, required: true },
    round1: { type: roundSchema, default: () => ({}) },
    round2: { type: roundSchema, default: () => ({}) },
    round3: { type: roundSchema, default: () => ({}) },
    marks: {
      round1: { type: Number, default: 0 },
      round2: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
  },
  members: [memberSchema],
  password: { type: String, required: true },
  problemStatement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProblemStatement",
    default: null,
  },
  marks: {
    // Team-level marks (for team performance/presentation)
    team: {
      round1: { type: Number, default: 0 },
      round2: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    // Sum of all member marks (for reference only)
    members: {
      round1: { type: Number, default: 0 },
      round2: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
  },
  status: {
    type: String,
    enum: ["Registered", "Active", "Disqualified"],
    default: "Registered",
  },
  submissions: [
    {
      portalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubmissionPortal",
      },
      link: { type: String },
      submittedAt: { type: Date, default: Date.now },
    },
  ],
  rank: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Add indexes for performance optimization
teamSchema.index({ teamId: 1 });
teamSchema.index({ "leader.email": 1 });
teamSchema.index({ status: 1 });
teamSchema.index({ "marks.team.total": -1 });
teamSchema.index({ rank: 1 });
teamSchema.index({ problemStatement: 1 });

module.exports = mongoose.model("Team", teamSchema);
