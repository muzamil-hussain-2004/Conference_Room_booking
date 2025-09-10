const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authenticateToken  = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles'); 


//get all users (Admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), usersController.getAllUsers);
router.get('/:id/bookings', authenticateToken, authorizeRoles('admin'), usersController.getUserBookings);

// edit user (Admin only)
router.patch('/:id', authenticateToken, authorizeRoles('admin'), usersController.editUser);

// disable user (Admin only)
router.patch('/:id/disable', authenticateToken, authorizeRoles('admin'), usersController.disableUser);


module.exports = router;