const express = require('express');
const router = express.Router();
const facilitiesController = require('../controllers/facilitiesController');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

//Add facility (admin)
router.post('/', authenticateToken, authorizeRoles('admin'), facilitiesController.addFacility);
router.patch('/:id', authenticateToken, authorizeRoles('admin'), facilitiesController.editFacility);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), facilitiesController.deleteFacility);
router.delete('/room/:room_id/:facility_id', authenticateToken, authorizeRoles('admin'), facilitiesController.unassignFacility);

// Assign facility to room (admin)
router.post('/assign', authenticateToken, authorizeRoles('admin'), facilitiesController.assignFacility);

// List facilities for room (public)
router.get('/room/:room_id', facilitiesController.getRoomFacilities);

router.get('/', facilitiesController.getAllFacilities);

module.exports = router;