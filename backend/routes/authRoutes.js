const express = require('express');
const router = express.Router();
const { registerTeam, loginTeam, loginAdmin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register-team', registerTeam);
router.post('/login-team', loginTeam);
router.post('/login-admin', loginAdmin);
router.get('/me', protect, getMe);

module.exports = router;
