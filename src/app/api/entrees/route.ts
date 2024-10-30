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
    // Query to fetch entrees from the food table
    const result = await pool.query('SELECT * FROM food WHERE type = $1;', ['entree']);
    
    return NextResponse.json({ entrees: result.rows });
  } catch (error) {
    console.error('Error fetching entrees:', error); // This will give us more details about the error
    return NextResponse.json({ error: 'Error fetching entree data' }, { status: 500 });
  }
}

console.log("Database Configuration:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '*****' : '(not set)',
  port: process.env.DB_PORT,
});
