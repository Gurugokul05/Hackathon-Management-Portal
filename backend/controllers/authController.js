const Team = require("../models/Team");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendRegistrationEmail } = require("../utils/emailService");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

const generateTeamId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "HACK26-";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// @desc Register a new team
// @route POST /api/auth/register-team
exports.registerTeam = async (req, res, next) => {
  const { teamName, leader, members } = req.body;

  try {
    // Validate emails (rudimentary check for duplicates across system could vary, for now just create)
    // Check if leader email is already used as leader?
    const existingLeader = await Team.findOne({ "leader.email": leader.email });
    if (existingLeader) {
      return res
        .status(400)
        .json({ message: "Team Leader email already registered." });
    }

    let teamId = generateTeamId();
    // Ensure uniqueness of ID
    while (await Team.findOne({ teamId })) {
      teamId = generateTeamId();
    }

    // We use leader email as the "password" for login verification, so we might not need to hash it if we compare directly,
    // BUT for consistency and security best practices (even if prompt is lax), we should store a hash if it were a real password.
    // However, prompt says "Email acts as password".
    // Logic: Login takes (TeamID, Email). We check if TeamID matches and Team.leader.email == Email.
    // So we don't strictly need a password field in DB if we trust the email in the document.
    // I added `password` to the schema earlier. I will set it to the hashed email just in case we switch to real passwords later.
    const hashedPassword = await bcrypt.hash(leader.email, 10);

    const team = await Team.create({
      teamId,
      teamName,
      leader,
      members,
      password: hashedPassword, // storing hashed email as password placeholder
    });

    // Send registration confirmation email (best effort)
    await sendRegistrationEmail(leader.email, teamName, teamId);

    res.status(201).json({
      teamId: team.teamId,
      message: `Team Registered! Your Team ID is ${team.teamId}. Please save it. A confirmation email has been sent to ${leader.email}.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Team Login
// @route POST /api/auth/login-team
exports.loginTeam = async (req, res, next) => {
  const { teamId, email } = req.body;

  try {
    const team = await Team.findOne({ teamId })
      .populate("problemStatement")
      .lean(); // Use lean() for better performance
    if (!team) {
      return res.status(401).json({ message: "Invalid Team ID" });
    }

    // Check if email matches leader email
    if (team.leader.email.toLowerCase() !== email.toLowerCase()) {
      return res
        .status(401)
        .json({ message: "Invalid Email for this Team ID" });
    }

    const token = generateToken(team._id, "team");

    delete team.password; // Remove password from response

    res.json({
      token,
      team: {
        ...team,
        role: "team",
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Admin Login
// @route POST /api/auth/login-admin
exports.loginAdmin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = generateToken(admin._id, admin.role);
      return res.json({
        token,
        admin: {
          username: admin.username,
          role: admin.role,
          permissions: admin.permissions || [],
        },
      });
    }

    res.status(401).json({ message: "Invalid Admin Credentials" });
  } catch (error) {
    next(error);
  }
};

// @desc Get Current User
// @route GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    if (req.user.role === "team") {
      const team = await Team.findById(req.user.id)
        .select("-password")
        .populate("problemStatement")
        .lean(); // Use lean() for better performance
      return res.json({ user: team, role: "team" });
    } else if (req.user.role === "admin" || req.user.role === "staff") {
      const admin = await Admin.findById(req.user.id)
        .select("-password")
        .lean(); // Use lean() for better performance
      return res.json({
        user: admin,
        role: admin.role || "admin",
        permissions: admin.permissions || [],
      });
    }
  } catch (error) {
    next(error);
  }
};
