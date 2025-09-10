const db = require('../db');
const sendEmail = require('../utils/sendEmail');

exports.bookRoom = async (req, res) => {
    const { room_id, start_time, end_time } = req.body;
    const user_id = req.user.id;

    try {
        // check for overlapping bookings
        const conflict = await db.query(
            `SELECT * FROM bookings WHERE room_id = $1 AND status = 'confirmed'
            AND NOT (end_time <= $2 OR start_time >= $3)`,
            [room_id, start_time, end_time]
        );
        if (conflict.rows.length) return res.status(400).json({ error: 'Room already booked for this time.' });

        const result = await db.query(
            `INSERT INTO bookings (user_id, room_id, start_time, end_time, status)
            VALUES ($1,$2,$3,$4, 'confirmed') RETURNING *`,
            [user_id, room_id, start_time, end_time]
        );

        // Get user email and room name for confirmation
        const userRes = await db.query('SELECT email FROM users WHERE id = $1', [user_id]);
        const roomRes = await db.query('SELECT name FROM rooms WHERE id = $1', [room_id]);
        const email = userRes.rows[0].email;
        const roomName = roomRes.rows[0].name;

        await sendEmail(
            email,
            'Booking Confirmation',
            `Your booking for room "${roomName}" from ${start_time} to ${end_time} is confirmed.`
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to book room.' });
    }

};

exports.getMyBookings = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM bookings WHERE user_id = $1 ORDER BY start_time DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch bookings." });
    }
};

//Admin View all bookings 
exports.getAllBookings = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT bookings.*, users.email, rooms.name AS room_name FROM bookings
            JOIN users ON bookings.user_id = users.id
            JOIN rooms ON bookings.room_id = rooms.id
            ORDER BY start_time DESC`
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
};

// Modify booking (user)

exports.editBooking = async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time } = req.body;
    try {
        // Check for overlapping bookings
        const booking = await db.query('SELECT room_id FROM bookings WHERE id = $1 AND user_id = $2',
            [id, req.user.id]);
        if (!booking.rows.length) return res.status(404).json({ error: 'Booking not fount.' });
        const room_id = booking.rows[0].room_id;

        const conflict = await db.query(
            `SELECT * FROM bookings WHERE room_id = $1 AND status = 'confirmed'
            AND NOT (end_time <= $2 OR start_time >= $3)`,
            [room_id, id, start_time, end_time]
        );
        if (conflict.rows.length) return res.status(400).json({ error: 'Room already booked for this time.' });

        await db.query(
            `UPDATE bookings SET start_time = $1, end_time = $2 WHERE id = $3 AND user_id = $4`,
            [start_time, end_time, id, req.user.id]
        );
        res.json({ message: 'Booking updated.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking.' });
    }
};

// cancel booking (user)
exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND user_id = $2`,
            [id, req.user.id]
        );
        res.status(200).json({ message: 'Booking cancelled successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel booking.' });
    }
};

exports.checkAvailability = async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time } = req.query;
    try {
        const conflict = await db.query(
            `SELECT * FROM bookings WHERE room_id = $1 AND status = 'confirmed'
            AND NOT (end_time <= $2 OR start_time >= $3)`,
            [id, start_time, end_time]
        );
        res.json({ available: conflict.rows.length === 0 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check availability.' });
    }
}

