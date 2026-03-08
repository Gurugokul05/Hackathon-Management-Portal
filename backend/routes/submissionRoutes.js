const express = require("express");
const router = express.Router();
const {
  createPortal,
  getPortals,
  submitLink,
  getAllSubmissions,
  deleteSubmission,
  bulkDeleteSubmissions,
  updatePortal,
  deletePortal,
  getSubmissionsByPortal,
  upsertSubmission,
} = require("../controllers/submissionController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/portals", protect, getPortals);
router.post("/submit", protect, submitLink);
router.post("/admin/portals", protect, adminOnly, createPortal);
router.put("/admin/portals/:id", protect, adminOnly, updatePortal); // Update portal
router.delete("/admin/portals/:id", protect, adminOnly, deletePortal); // Delete portal
router.get("/admin/all", protect, adminOnly, getAllSubmissions);
router.get(
  "/admin/portal/:portalId",
  protect,
  adminOnly,
  getSubmissionsByPortal,
);
router.delete("/admin/:portalId", protect, adminOnly, bulkDeleteSubmissions);
router.delete("/admin/:teamId/:portalId", protect, adminOnly, deleteSubmission);
router.put("/admin/:teamId/:portalId", protect, adminOnly, upsertSubmission);

module.exports = router;
