const cors = require('cors');
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db');

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

app.listen(3000, () => console.log('server running on port 3000'));