const express = require('express');
const router = express.Router();
const { getNotices, createNotice, createComplaint, getComplaints, resolveComplaint, updateNotice, deleteNotice } = require('../controllers/communicationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Notices
router.get('/notices', protect, getNotices);
router.post('/notices', protect, adminOnly, createNotice);
router.put('/notices/:id', protect, adminOnly, updateNotice);    // Update Notice
router.delete('/notices/:id', protect, adminOnly, deleteNotice); // Delete Notice

// Complaints
router.get('/complaints', protect, getComplaints);
router.post('/complaints', protect, createComplaint);
router.put('/complaints/:id', protect, adminOnly, resolveComplaint);

module.exports = router;
