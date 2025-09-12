const cors = require('cors');
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db');
const cron = require('node-cron');
const sendEmail = require('./utils/sendEmail');

cron.schedule('*/10 * * * *', async () => {
    //for sendind reminder emails 

    const now = new Date();
    const soon = new Date(now.getTime() + 60 * 60 * 1000);
    const result = await db.query(
        `SELECT bookings.id, users.email, rooms.name, bookings.start_time
        FROM bookings
        JOIN users ON bookings.user_id = users.id
        JOIN rooms ON bookings.room_id = rooms.id
        WHERE bookings.status = 'confirmed'
        AND bookings.start_time > $1 AND bookings.start_time <= $2`,
        [now.toISOString(), soon.toISOString()]
    );
    for (const b of result.rows) {
        await sendEmail(
            b.email,
            'Booking Reminder',
            `Reminder: Your booking for room "${b.name}" starts at ${new Date(b.start_time).toLocalString}`
        );
        // optionally log notification in db
        await db.query(
            `INSERT INTO notifications (user_id, booking_id, type, message, sent_at)
            VALUES ($1, $2, 'reminder', $3, NOW())`,
            [b.user_id, b.id, `Reminder: sent for booking at ${b.start_time}`]
        );
    }

});

app.use(cors());


app.use(express.json());

app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ connected: true, time: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ connected: false, error: error.message });
    }
});

app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/rooms', require('./routes/rooms'));
app.use('/bookings', require('./routes/booking'));
app.use('/facilities', require('./routes/facilities'));
app.use('/uploads', express.static('uploads'));

app.listen(3000, () => console.log('server running on port 3000'));