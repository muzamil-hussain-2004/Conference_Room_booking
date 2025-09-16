const db = require('../db');

exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query(`SELECT users.id, users.email, users.name, users.is_active, roles.name AS role
            FROM users JOIN roles ON users.role_id = roles.id`);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

exports.editUser = async (req, res) => {
    const { id } = req.params;
    const { email, name, role } = req.body;
    try {
        let roleId;
        if (role) {
            const roleResult = await db.query('SELECT id FROM roles WHERE name = $1', [role]);
            if (!roleResult.rows.length) return res.status(400).json({ error: "invalid role." });
            roleId = roleResult.rows[0].id;
        }
        await db.query(
            `UPDATE users SET email = COALESCE($1, email),
            name = COALESCE($2, name),
            role_id = COALESCE($3, role_id) WHERE id = $4`,
            [email, name, roleId, id]
        );
        res.json({ message: 'User updated.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user.' });
    }
}

exports.disableUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE users SET is_active = FALSE WHERE id = $1', [id]);
        res.json({ message: "User disabled." });
    } catch (error) {
        res.status(500).json({ error: 'Failed to disable user.' });
    }
};

exports.getUserBookings = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            `SELECT bookings.*, rooms.name AS room_name 
            FROM bookings JOIN rooms ON bookings.room_id = rooms.id
            WHERE bookings.user_id = $1 
            ORDER BY start_time DESC`,
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            `SELECT users.id, users.email, users.name, users.is_active, roles.name AS role
            FROM users JOIN roles ON users.role_id = roles.id
            WHERE users.id = $1`,
            [userId]
        );
        if (!result.rows.length) return res.status(404).json({ error: "User not found." });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
};
