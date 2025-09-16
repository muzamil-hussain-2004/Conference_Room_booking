const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authenticateToken  = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles'); 

const { getMe } = require("../controllers/usersController");
const auth = require("../middleware/auth");

//get all users (Admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), usersController.getAllUsers);
router.get('/:id/bookings', authenticateToken, authorizeRoles('admin'), usersController.getUserBookings);

// edit user (Admin only)
router.patch('/:id', authenticateToken, authorizeRoles('admin'), usersController.editUser);

// disable user (Admin only)
router.patch('/:id/disable', authenticateToken, authorizeRoles('admin'), usersController.disableUser);

//audit logs
router.get('/me/audit-logs', authenticateToken, async (req, res) => {
    const db = require('../db');
    try {
        const result = await db.query(
            `SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch audit logs.' });
    }
});

//profile
router.get("/me", auth, getMe);


module.exports = router;