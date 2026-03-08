const Notice = require("../models/Notice");
const Complaint = require("../models/Complaint");

// Notices
exports.getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    next(error);
  }
};

exports.createNotice = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description are required" });
    }
    const validCategories = ["General", "Important", "Round Update"];
    const validCategory = validCategories.includes(category)
      ? category
      : "General";
    const notice = await Notice.create({
      title,
      description,
      category: validCategory,
    });
    res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
};

exports.updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json(notice);
  } catch (error) {
    next(error);
  }
};

exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json({ message: "Notice removed" });
  } catch (error) {
    next(error);
  }
};

// Complaints
exports.createComplaint = async (req, res, next) => {
  const { category, description } = req.body;
  try {
    if (!category || !description) {
      return res
        .status(400)
        .json({ message: "category and description are required" });
    }
    const complaint = await Complaint.create({
      team: req.user.id,
      category,
      description,
    });
    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    let complaints;
    if (req.user.role === "admin") {
      complaints = await Complaint.find()
        .populate("team", "teamName teamId")
        .sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find({ team: req.user.id }).sort({
        createdAt: -1,
      });
    }
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

exports.resolveComplaint = async (req, res, next) => {
  const { status, adminResponse } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (status) complaint.status = status;
    if (adminResponse) complaint.adminResponse = adminResponse;

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    next(error);
  }
};
