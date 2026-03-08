const Team = require("../models/Team");
const AttendanceControl = require("../models/AttendanceControl");
const { clearCache } = require("../middleware/cacheMiddleware");

const DEFAULT_LOCKS = {
  round1: true,
  round2: false,
  round3: false,
};

const getGlobalLocks = async () => {
  const control = await AttendanceControl.findOne({ scope: "global" }).lean();
  if (control?.locks) return control.locks;

  const sampleTeam = await Team.findOne().select("attendanceLocks").lean();
  return sampleTeam?.attendanceLocks || DEFAULT_LOCKS;
};

// @desc Get all teams
// @route GET /api/teams
exports.getAllTeams = async (req, res, next) => {
  try {
    // If not full admin, check if user has marks:update permission to include marks
    const isAdmin =
      req.authz?.isAdmin || (req.user && req.user.role === "admin");
    const hasMarksPermission = req.authz?.permissions?.includes("marks:update");

    const query = Team.find().lean(); // Use lean() for better performance
    // Only hide marks if user is not admin and doesn't have marks:update permission
    if (!isAdmin && !hasMarksPermission) {
      query.select("-marks");
    }
    const teams = await query.populate("problemStatement", "title");
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

// @desc Get Leaderboard
// @route GET /api/teams/leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const teams = await Team.find({ status: { $ne: "Disqualified" } })
      .select("teamName marks rank")
      .sort({ "marks.team.total": -1 })
      .lean(); // Use lean() for faster queries

    const leaderboard = teams.map((team, index) => ({
      ...team,
      rank: index + 1,
    }));

    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
};

// @desc Update marks
// @route PUT /api/teams/:id/marks
exports.updateMarks = async (req, res, next) => {
  const { memberMarks, teamMarks } = req.body;
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Update team-level marks
    if (teamMarks) {
      if (teamMarks.round1 !== undefined)
        team.marks.team.round1 = teamMarks.round1;
      if (teamMarks.round2 !== undefined)
        team.marks.team.round2 = teamMarks.round2;
      team.marks.team.total =
        (team.marks.team.round1 || 0) + (team.marks.team.round2 || 0);
    }

    // Update individual member marks
    if (memberMarks) {
      for (const [memberId, marks] of Object.entries(memberMarks)) {
        if (memberId === "leader") {
          if (marks.round1 !== undefined)
            team.leader.marks.round1 = marks.round1;
          if (marks.round2 !== undefined)
            team.leader.marks.round2 = marks.round2;
          team.leader.marks.total =
            (team.leader.marks.round1 || 0) + (team.leader.marks.round2 || 0);
        } else {
          const member = team.members.id(memberId);
          if (member) {
            if (marks.round1 !== undefined) member.marks.round1 = marks.round1;
            if (marks.round2 !== undefined) member.marks.round2 = marks.round2;
            member.marks.total =
              (member.marks.round1 || 0) + (member.marks.round2 || 0);
          }
        }
      }
    }

    // Calculate member totals (sum of all individual member marks)
    const memberR1 =
      (team.leader.marks?.round1 || 0) +
      team.members.reduce((sum, m) => sum + (m.marks?.round1 || 0), 0);
    const memberR2 =
      (team.leader.marks?.round2 || 0) +
      team.members.reduce((sum, m) => sum + (m.marks?.round2 || 0), 0);
    const memberTotal = memberR1 + memberR2;

    team.marks.members.round1 = memberR1;
    team.marks.members.round2 = memberR2;
    team.marks.members.total = memberTotal;

    await team.save();
    clearCache("/api/teams"); // Clear cache after marks update
    res.json({ message: "Marks updated", team });
  } catch (error) {
    next(error);
  }
};

// @desc Update Member Attendance (Manual Toggle)
// @route PUT /api/teams/:id/attendance/member
exports.updateMemberAttendance = async (req, res, next) => {
  const { memberId, round, status } = req.body; // status is boolean for manual toggle

  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const finalStatus = status ? "Verified" : "Rejected";

    if (memberId === "leader") {
      team.leader[round].status = finalStatus;
      team.leader[round].submittedAt = Date.now();
      team.markModified(`leader.${round}`);
    } else {
      const mIdx = team.members.findIndex(
        (m) => m._id.toString() === memberId.toString(),
      );
      if (mIdx !== -1) {
        team.members[mIdx][round].status = finalStatus;
        team.members[mIdx][round].submittedAt = Date.now();
        team.markModified(`members.${mIdx}.${round}`);
      } else {
        return res.status(404).json({ message: "Member not found" });
      }
    }

    await team.save();
    clearCache("/api/teams"); // Clear cache after attendance update
    res.json({ message: "Attendance status updated", team });
  } catch (error) {
    next(error);
  }
};

// @desc Get current attendance locks snapshot
// @route GET /api/teams/attendance/lock
exports.getAttendanceLocks = async (req, res, next) => {
  try {
    const locks = await getGlobalLocks();
    res.json({ locks });
  } catch (error) {
    next(error);
  }
};

// @desc Submit Attendance Photo (Deep Isolation) with round locks
exports.submitAttendancePhoto = async (req, res, next) => {
  const { memberId, role, round, photo } = req.body;
  try {
    // Validate photo size (max 500KB to prevent document bloat)
    if (photo && typeof photo === "string") {
      const photoSizeKB = Buffer.byteLength(photo, "utf8") / 1024;
      if (photoSizeKB > 500) {
        return res.status(400).json({
          message: `Photo too large (${Math.round(photoSizeKB)}KB). Max 500KB allowed.`,
        });
      }
    }
    const team = await Team.findById(req.user.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Enforce round lock (merge global config and team snapshot)
    const globalLocks = await getGlobalLocks();
    const locks = {
      ...DEFAULT_LOCKS,
      ...globalLocks,
      ...(team.attendanceLocks || {}),
    };
    if (!locks[round]) {
      return res
        .status(403)
        .json({ message: `Attendance for ${round} is locked by admin.` });
    }

    if (memberId === "leader") {
      team.leader[round] = {
        status: "Pending",
        photo: photo,
        submittedAt: Date.now(),
      };
      team.markModified(`leader.${round}`);
    } else {
      const mIdx = team.members.findIndex(
        (m) => m._id.toString() === memberId.toString(),
      );
      if (mIdx !== -1) {
        team.members[mIdx][round] = {
          status: "Pending",
          photo: photo,
          submittedAt: Date.now(),
        };
        team.markModified(`members.${mIdx}.${round}`);
      } else {
        return res.status(404).json({ message: "Member not found" });
      }
    }

    await team.save();
    clearCache("/api/teams"); // Clear cache after attendance photo submitted
    res.json({ message: "Attendance frame transmitted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc Update round attendance lock (admin only)
// @route PUT /api/teams/attendance/lock
exports.updateAttendanceLock = async (req, res, next) => {
  const { round, open } = req.body; // round: 'roundN', open: boolean
  try {
    if (!/^round\d+$/.test(round)) {
      return res.status(400).json({ message: "Invalid round format" });
    }

    const desiredValue = !!open;

    // Persist global control (supports zero-team state)
    const control = await AttendanceControl.findOneAndUpdate(
      { scope: "global" },
      {
        $set: {
          [`locks.${round}`]: desiredValue,
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();

    // Update all teams so their snapshots stay in sync
    await Team.updateMany(
      {},
      { $set: { [`attendanceLocks.${round}`]: desiredValue } },
    );

    res.json({
      message: `Attendance ${desiredValue ? "unlocked" : "locked"} for ${round}`,
      locks: control?.locks || DEFAULT_LOCKS,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify Attendance Photo (Deep Isolation)
exports.verifyAttendancePhoto = async (req, res, next) => {
  const { memberId, round, status } = req.body;
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (memberId === "leader") {
      if (team.leader[round]) {
        team.leader[round].status = status;
        team.markModified(`leader.${round}`);
      }
    } else {
      const mIdx = team.members.findIndex(
        (m) => m._id.toString() === memberId.toString(),
      );
      if (mIdx !== -1) {
        if (team.members[mIdx][round]) {
          team.members[mIdx][round].status = status;
          team.markModified(`members.${mIdx}.${round}`);
        }
      }
    }

    await team.save();
    res.json({ message: `Personnel verified: ${status}`, team });
  } catch (error) {
    next(error);
  }
};

// @desc Add a new round for attendance
// @route POST /api/teams/attendance/add-round
exports.addAttendanceRound = async (req, res, next) => {
  try {
    const control = await AttendanceControl.findOne({ scope: "global" });
    if (!control) {
      return res.status(500).json({ message: "Attendance control not found" });
    }

    const newRoundNumber = control.totalRounds + 1;
    const newRoundName = `round${newRoundNumber}`;

    // Add lock for new round
    control.locks[newRoundName] = false; // New rounds unlocked by default
    control.totalRounds = newRoundNumber;
    control.updatedAt = new Date();
    await control.save();

    // Add new round fields to all teams
    const roundObj = { status: "Not Captured", photo: null, submittedAt: null };
    await Team.updateMany(
      {},
      {
        $set: {
          [`leader.${newRoundName}`]: roundObj,
          [`attendanceLocks.${newRoundName}`]: false,
        },
      },
    );

    // Add new round to all members
    await Team.updateMany(
      { members: { $exists: true } },
      {
        $set: {
          [`members.$[].${newRoundName}`]: roundObj,
        },
      },
      { arrayFilters: [] },
    );

    res.json({
      message: `Round ${newRoundNumber} added successfully`,
      totalRounds: newRoundNumber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get total rounds
// @route GET /api/teams/attendance/rounds
exports.getTotalRounds = async (req, res, next) => {
  try {
    const control = await AttendanceControl.findOne({ scope: "global" });
    const totalRounds = control?.totalRounds || 3;
    res.json({ totalRounds });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a round (remove it from all teams)
// @route DELETE /api/teams/attendance/round/:roundName
exports.deleteAttendanceRound = async (req, res, next) => {
  try {
    const { roundName } = req.params;

    // Validate round name format
    if (!roundName.match(/^round\d+$/)) {
      return res.status(400).json({ message: "Invalid round name format" });
    }

    const control = await AttendanceControl.findOne({ scope: "global" });
    if (!control) {
      return res.status(500).json({ message: "Attendance control not found" });
    }

    const roundNumber = parseInt(roundName.replace("round", ""));
    if (roundNumber < 1) {
      return res.status(400).json({ message: "Invalid round number" });
    }

    // Can't delete if no control record (shouldn't happen)
    if (!control.locks.hasOwnProperty(roundName)) {
      return res.status(400).json({ message: "Round does not exist" });
    }

    if (control.totalRounds <= 1) {
      return res.status(400).json({ message: "Cannot delete the last round" });
    }

    // Remove round from locks
    delete control.locks[roundName];
    control.totalRounds -= 1;
    control.updatedAt = new Date();
    await control.save();

    // Remove round from all team leaders
    await Team.updateMany(
      {},
      {
        $unset: {
          [`leader.${roundName}`]: 1,
          [`attendanceLocks.${roundName}`]: 1,
        },
      },
    );

    // Remove round from all team members
    await Team.updateMany(
      { members: { $exists: true } },
      {
        $unset: {
          [`members.$[].${roundName}`]: 1,
        },
      },
      { arrayFilters: [] },
    );

    res.json({
      message: `Round ${roundNumber} deleted successfully`,
      totalRounds: control.totalRounds,
    });
  } catch (error) {
    next(error);
  }
};
