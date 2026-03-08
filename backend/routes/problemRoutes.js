const express = require('express');
const router = express.Router();
const { getProblems, createProblem, selectProblem } = require('../controllers/problemController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getProblems);
router.post('/', protect, adminOnly, createProblem);
router.post('/select', protect, selectProblem);

module.exports = router;
