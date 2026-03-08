const ProblemStatement = require("../models/ProblemStatement");
const Team = require("../models/Team");

// @desc Get all problem statements
// @route GET /api/problems
exports.getProblems = async (req, res, next) => {
  try {
    const problems = await ProblemStatement.find({ visible: true });
    res.json(problems);
  } catch (error) {
    next(error);
  }
};

// @desc Create a problem statement
// @route POST /api/problems
exports.createProblem = async (req, res, next) => {
  const { title, domain, difficulty, description } = req.body;
  try {
    if (!title || !domain || !difficulty || !description) {
      return res.status(400).json({
        message:
          "All fields (title, domain, difficulty, description) are required",
      });
    }
    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res
        .status(400)
        .json({ message: "Difficulty must be Easy, Medium, or Hard" });
    }
    const problem = await ProblemStatement.create({
      title,
      domain,
      difficulty,
      description,
    });
    res.status(201).json(problem);
  } catch (error) {
    next(error);
  }
};

// @desc Select a problem for a team
// @route POST /api/problems/select
exports.selectProblem = async (req, res, next) => {
  const { problemId } = req.body;
  const teamId = req.user.id; // From auth middleware

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.problemStatement) {
      return res
        .status(400)
        .json({ message: "Problem statement already selected" });
    }

    const problem = await ProblemStatement.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    team.problemStatement = problemId;
    await team.save();

    res.json({
      message: `Problem "${problem.title}" selected successfully`,
      problem,
    });
  } catch (error) {
    next(error);
  }
};
