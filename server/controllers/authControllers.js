const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
    const { email, password, name, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const roleIdResult = await db.query('SELECT id FROM roles WHERE name = $1', [role || 'user']);
    const roleId = roleIdResult.rows[0].id;
    try {
        const result = await db.query(
            'INSERT INTO users (email, password_hash, name, role_id) VALUES ($1, $2, $3, $4) RETURNING id, email',
            [email, hashed, name, roleId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: 'User already exists or invalid data.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const userResult = await db.query(
        'SELECT users.*, roles.name as role FROM users JOIN roles ON users.role_id = roles.id WHERE email = $1',
        [email]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(400).json({ error: "invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: "invalid credentials" });

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    res.json({ token });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const userResult = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!userResult.rows.length) return res.status(400).json({ message: "If user exists, email sent." });

    const userId = userResult.rows[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await db.query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expires]
    );

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    await sendEmail(email, 'password Reset', `Reset your password: ${resetLink}`);

    res.json({ message: "If user exists, email sent." });

}
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const tokenResult = await db.query(
        'SELECT * FROM password_reset_tokens WHERE token = $1 AND used = FALSE AND expires_at > NOW()', [token]
    );

    if (!tokenResult.rows.length) return res.status(400).json({ error: "Invalid or expired token." });

    const userId = tokenResult.rows[0].user_id;
    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, userId]);

    await db.query('UPDATE password_reset_tokens SET used = TRUE WHERE token = $1', [token]);

    res.json({ message: "Password reset successful." });

};