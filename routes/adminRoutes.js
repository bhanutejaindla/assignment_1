const express = require('express');
const { registerAdmin, loginAdmin, getAssignments, acceptAssignment, rejectAssignment } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/assignments', protect, getAssignments);
router.post('/assignments/:id/accept', protect, acceptAssignment);
router.post('/assignments/:id/reject', protect, rejectAssignment);

module.exports = router;
