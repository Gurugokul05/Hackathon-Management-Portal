const mongoose = require("mongoose");
const Team = require("../models/Team");
const SubmissionPortal = require("../models/SubmissionPortal");

// @desc Create a new submission portal (Admin)
exports.createPortal = async (req, res, next) => {
  try {
    const { title, description, deadline, isActive } = req.body;
    if (!title || !deadline) {
      return res
        .status(400)
        .json({ message: "title and deadline are required" });
    }
    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({ message: "deadline must be a valid date" });
    }
    const portal = await SubmissionPortal.create({
      title,
      description: description || "",
      deadline: parsedDeadline,
      isActive: isActive !== false,
    });
    res.status(201).json(portal);
  } catch (error) {
    next(error);
  }
};

// @desc Get all submission portals
exports.getPortals = async (req, res, next) => {
  try {
    const portals = await SubmissionPortal.find().sort({ createdAt: -1 });
    res.json(portals);
  } catch (error) {
    next(error);
  }
};

// @desc Submit link (Team)
exports.submitLink = async (req, res, next) => {
  const { portalId, link } = req.body;
  try {
    const team = await Team.findById(req.user.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Check if portal exists and deadline hasn't passed
    const portal = await SubmissionPortal.findById(portalId);
    if (!portal) return res.status(404).json({ message: "Portal not found" });

    const now = new Date();
    if (now > portal.deadline) {
      return res
        .status(403)
        .json({
          message: "Submission deadline has passed. Uploads are now locked.",
        });
    }

    const submissionIndex = team.submissions.findIndex(
      (s) => s.portalId.toString() === portalId,
    );
    if (submissionIndex > -1) {
      return res
        .status(403)
        .json({ message: "Submission already exists and is locked." });
    } else {
      team.submissions.push({ portalId, link });
    }

    await team.save();
    res.json({ message: "Submission Successful" });
  } catch (error) {
    next(error);
  }
};

// @desc Get all submissions for admin
exports.getAllSubmissions = async (req, res, next) => {
  try {
    const teams = await Team.find({ "submissions.0": { $exists: true } })
      .select("teamName teamId leader submissions")
      .populate("submissions.portalId");
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

// @desc Get submissions filtered by portal (Admin)
exports.getSubmissionsByPortal = async (req, res, next) => {
  const { portalId } = req.params;
  try {
    const teams = await Team.find({
      "submissions.portalId": new mongoose.Types.ObjectId(portalId),
    })
      .select("teamName teamId leader submissions")
      .populate("submissions.portalId");

    // Filter submissions array to only include the requested portal
    const filtered = teams.map((t) => ({
      _id: t._id,
      teamName: t.teamName,
      teamId: t.teamId,
      leader: t.leader,
      submissions: t.submissions.filter(
        (s) =>
          (s.portalId &&
            s.portalId._id &&
            s.portalId._id.toString() === portalId) ||
          s.portalId?.toString() === portalId,
      ),
    }));

    res.json(filtered);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a team's submission
exports.deleteSubmission = async (req, res, next) => {
  const { teamId, portalId } = req.params;
  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.submissions = team.submissions.filter(
      (s) => s.portalId.toString() !== portalId,
    );
    await team.save();
    res.json({ message: "Submission deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc Upsert (create/update) a team's submission for a portal (Admin)
exports.upsertSubmission = async (req, res, next) => {
  const { teamId, portalId } = req.params;
  const { link } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const idx = team.submissions.findIndex(
      (s) => s.portalId.toString() === portalId,
    );
    if (idx > -1) {
      team.submissions[idx].link = link;
      team.submissions[idx].submittedAt = new Date();
    } else {
      team.submissions.push({
        portalId: new mongoose.Types.ObjectId(portalId),
        link,
        submittedAt: new Date(),
      });
    }

    await team.save();
    res.json({ message: "Submission upserted successfully", teamId, portalId });
  } catch (error) {
    next(error);
  }
};

// @desc Delete all submissions for a specific portal
exports.bulkDeleteSubmissions = async (req, res, next) => {
  const { portalId } = req.params;
  try {
    await Team.updateMany(
      {},
      {
        $pull: {
          submissions: { portalId: new mongoose.Types.ObjectId(portalId) },
        },
      },
    );
    res.json({ message: "All submissions for this round have been deleted." });
  } catch (error) {
    next(error);
  }
};

// @desc Update portal (Admin)
exports.updatePortal = async (req, res, next) => {
  try {
    const portal = await SubmissionPortal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!portal) return res.status(404).json({ message: "Portal not found" });
    res.json(portal);
  } catch (error) {
    next(error);
  }
};

// @desc Delete portal (Admin)
exports.deletePortal = async (req, res, next) => {
  try {
    const portal = await SubmissionPortal.findById(req.params.id);
    if (!portal) return res.status(404).json({ message: "Portal not found" });

    // Delete all submissions associated with this portal first
    await Team.updateMany(
      {},
      { $pull: { submissions: { portalId: portal._id } } },
    );

    await portal.deleteOne();
    res.json({ message: "Portal and associated submissions removed" });
  } catch (error) {
    next(error);
  }
};
