const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', roomsController.getAllRooms);
router.get('/search', roomsController.searchRooms);
router.get('/:id', roomsController.getRoomById);


//Admin-only routes
router.post('/', authenticateToken, authorizeRoles('admin'), upload.single('image'), roomsController.addRoom);
router.patch('/:id', authenticateToken, authorizeRoles('admin'), upload.single('image'),  roomsController.editRoom);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), roomsController.deleteRoom);

module.exports = router;