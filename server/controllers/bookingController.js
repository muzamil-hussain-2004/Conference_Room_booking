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
    const { room_id, user_id, date } = req.query;
    let query = `SELECT bookings.*, users.email, rooms.name AS room_name FROM bookings
   JOIN users ON bookings.user_id = users.id
   JOIN rooms ON bookings.room_id = rooms.id
   WHERE 1=1`;
    let params = [];
    if (room_id) {
        query += ` AND bookings.room_id = $${params.length + 1}`;
        params.push(room_id);
    }
    if (user_id) {
        query += ` AND bookings.user_id = $${params.length + 1}`;
        params.push(user_id);
    }
    if (date) {
        query += ` AND DATE(bookings.start_time) = $${params.length + 1}`;
        params.push(date);
    }
    query += " ORDER BY bookings.start_time DESC";
    try {
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "FAILED to fetch bookings." });
    }
};

// Modify booking (user)

exports.editBooking = async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time } = req.body;
    try {
        // Get the room_id for this booking
        const booking = await db.query('SELECT room_id FROM bookings WHERE id = $1 AND user_id = $2',
            [id, req.user.id]);
        if (!booking.rows.length) return res.status(404).json({ error: 'Booking not found.' });
        const room_id = booking.rows[0].room_id;

        // Check for overlapping bookings (exclude current booking)
        const conflict = await db.query(
            `SELECT * FROM bookings WHERE room_id = $1 AND status = 'confirmed'
            AND id != $2
            AND NOT (end_time <= $3 OR start_time >= $4)`,
            [room_id, id, start_time, end_time]
        );
        if (conflict.rows.length) return res.status(400).json({ error: 'Room already booked for this time.' });

        await db.query(
            `UPDATE bookings SET start_time = $1, end_time = $2 WHERE id = $3 AND user_id = $4`,
            [start_time, end_time, id, req.user.id]
        );
        await db.query(
            `INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)`,
            [req.user.id, 'edit_booking', `Booking ${id} updated to ${start_time} - ${end_time}`]
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
        await db.query(
            `INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)`,
            [req.user.id, 'cancel_booking', `Booking ${id} cancelled`]
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
};

exports.getCalendarBookings = async (req, res) => {
    const { room_id, date } = req.query;
    let query = `SELECT bookings.*, rooms.name AS room_name FROM bookings
    JOIN rooms ON bookings.room_id = rooms.id WHERE bookings.status != 'cancelled'`;
    let params = [];
    if (room_id) {
        query += " AND bookings.room_id = $" + (params.length + 1);
        params.push(room_id);
    }
    if (date) {
        query += " AND DATE(bookings.start_time) = $" + (params.length + 1);
        params.push(date);
    }
    query += " ORDER BY bookings.start_time ASC";
    try {
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
};


exports.getBookingStats = async (req, res) => {
    try {
        const total = await db.query("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'");
        const byRoom = await db.query(
            "SELECT rooms.name, COUNT(*) FROM bookings JOIN rooms ON bookings.room_id = rooms.id WHERE bookings.status = 'confirmed' GROUP BY rooms.name"
        );
        const byUser = await db.query(
            "SELECT users.email, COUNT(*) FROM bookings JOIN users ON bookings.user_id = users.id WHERE bookings.status = 'confirmed' GROUP BY users.email"
        );
        res.json({
            total: total.rows[0].count,
            byRoom: byRoom.rows,
            byUser: byUser.rows
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats.' });
    }
};

