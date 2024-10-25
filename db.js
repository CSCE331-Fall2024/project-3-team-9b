require('dotenv').config(); // Load environment variables from .env
const { Pool } = require('pg');

// Set up a connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Failed to connect to the database:', err.stack);
  }
  console.log('Connected to PostgreSQL successfully!');
  release();
});

module.exports = pool; // Export the pool for other files
