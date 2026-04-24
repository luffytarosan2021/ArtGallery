const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'art_gallery_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL DB connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };

