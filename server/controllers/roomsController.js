const db = require('../db');

// Get all rooms (public)

exports.getAllRooms = async (req, res) => {
    try {
        const result = await db.query('SELECT * From rooms');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms.' });
    }
};

//get room by id (public)
exports.getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM rooms WHERE id = $1', [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Room not found." });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch room." });
    }
};

//Add room (Admin only)
exports.addRoom = async (req, res) => {
    const { name, location, capacity, description, image_url } = req.body;
    let finalImageUrl = image_url;
    if (req.file) {
        finalImageUrl = `/uploads/${req.file.filename}`;
    }
    try {
        const result = await db.query(
            'INSERT INTO rooms (name, location, capacity, description, image_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [name, location, capacity, description, finalImageUrl]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add room.' });
    }
};

// Admin only   
exports.editRoom = async (req, res) => {
    const { id } = req.params;
    const { name, location, capacity, description, image_url } = req.body;
    try {
        await db.query(
            `UPDATE rooms SET name = COALESCE($1, NAME),
            location = COALESCE($2, location),
            capacity = COALESCE($3, capacity),
            description = COALESCE($4, description),
            image_url = COALESCE($5, image_url) WHERE id = $6`,
            [name, location, capacity, description, image_url, id]
        );
        res.json({ message: 'Room updated.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update room.' });
    }
};

// DELETE ROOM (Admin only)
exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM rooms WHERE id = $1', [id]);
        res.json({ message: 'Room deleted.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete room.' });
    }
};

// Search rooms (public)
exports.searchRooms = async (req, res) => {
    const { name, capacity, facility } = req.query;
    let query = 'SELECT rooms.* FROM rooms';
    let params = [];
    let where = [];

    if (facility) {
        query += ' JOIN room_facilities ON rooms.id = room_facilities.room_id JOIN facilities ON room_facilities.facility_id = facilities.id';
        where.push('facilities.name ILIKE $' + (params.length + 1));
        params.push(`%${facility}%`);
    }
    if (name) {
        where.push('rooms.name ILIKE $' + (params.length + 1));
        params.push(`%${name}%`);
    }
    if (capacity) {
        where.push('rooms.capacity >= $' + (params.length + 1));
        params.push(capacity);
    }
    if (where.length) query += ' WHERE ' + where.join(' AND ');
    const result = await db.query(query, params);
    res.json(result.rows);
};

