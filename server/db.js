
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.user_name,
    host: process.env.host,
    database: process.env.database_name,
    password: process.env.user_password,
    port: process.env.port,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};