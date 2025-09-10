const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingController');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

//book a room (user)
router.post('/', authenticateToken, bookingsController.bookRoom);

// View my bookigs (user)
router.get('/', authenticateToken, bookingsController.getMyBookings);

//Admin view all bookings
router.get('/all', authenticateToken, authorizeRoles('admin'), bookingsController.getAllBookings);

// Modify booking (user)
router.patch('/:id', authenticateToken, bookingsController.editBooking);

// Cancel booking (user)
router.delete('/:id', authenticateToken, bookingsController.cancelBooking);

router.get('/calendar', authenticateToken, bookingsController.getCalendarBookings);

// Check room availability (public/user)
router.get('/availability', bookingsController.checkAvailability);

//stats
router.get('/stats', authenticateToken, authorizeRoles('admin'), bookingsController.getBookingStats);

module.exports = router;