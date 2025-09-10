const db = require('../db');

exports.addFacility = async (req, res) => {
    const { name } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO facilities (name) VALUES ($1) RETURNING *',
            [name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add facility. ' });
    }
};

// Assign facility to room (admin)

exports.assignFacility = async (req, res) => {
    const { room_id, facility_id } = req.body;
    try {
        await db.query(
            'INSERT INTO room_facilities (room_id, facility_id) VALUES ($1, $2)',
            [room_id, facility_id]);
        res.json({ message: 'Facility assigned to room.' });
    } catch (error) {
        res.status(500).json({ error: "Failed to assign facility." });
    }
};

// List facilities for room (public)
exports.getRoomFacilities = async (req, res) => {
    const { room_id } = req.params;
    try {
        const result = await db.query(
            `SELECT facilities.id, facilities.name FROM room_facilities
             JOIN facilities ON room_facilities.facility_id = facilities.id
             WHERE room_facilities.room_id = $1`,
            [room_id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch facilities.' });
    }
};

exports.getAllFacilities = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM facilities');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch facilities.' });
    }
};

exports.editFacility = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        await db.query('UPDATE facilities SET name = $1 WHERE id = $2', [name, id]);
        res.json({ message: 'Facility updated.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update facility.' });
    }
};

exports.deleteFacility = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM facilities WHERE id = $1', [id]);
        res.json({ message: 'Facility deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete facility.' });
    }
};

exports.unassignFacility = async (req, res) => {
    const { room_id, facility_id } = req.params;
    try {
        await db.query('DELETE FROM room_facilities WHERE room_id = $1 AND facility_id = $2', [room_id, facility_id]);
        res.json({ message: 'Facility unassigned from room.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unassign facility.' });
    }
};
