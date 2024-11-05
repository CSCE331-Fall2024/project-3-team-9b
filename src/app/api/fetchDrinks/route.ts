import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: { rejectUnauthorized: false }, // Modify based on SSL requirements
});

export async function GET() {
  try {
    // Query to fetch only items from the food table where type is 'drink'
    const result = await pool.query('SELECT * FROM food WHERE type = $1;', ['drink']);
    return NextResponse.json({ drinks: result.rows });
  } catch (error) {
    console.error('Error fetching drinks:', error); // This will give us more details about the error
    return NextResponse.json({ error: 'Error fetching drinks data' }, { status: 500 });
  }
}

// Log the database configuration for debugging
console.log("Database Configuration:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '*****' : '(not set)',
  port: process.env.DB_PORT,
});
