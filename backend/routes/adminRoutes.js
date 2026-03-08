const express = require("express");
const router = express.Router();
const {
  listAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminManageController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect, adminOnly);

router.get("/", listAdmins);
router.post("/", createAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;
