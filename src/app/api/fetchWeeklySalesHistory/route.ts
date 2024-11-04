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
    const result = await pool.query('SELECT EXTRACT(WEEK FROM Transaction_Date) AS week_number, COUNT(Transaction_ID) AS total_orders FROM Transactions GROUP BY week_number ORDER BY week_number;');
    return NextResponse.json({ weeks: result.rows });
  } catch (error) {
    console.error('Error fetching weekly sales history:', error); // This will give us more details about the error
    return NextResponse.json({ error: 'Error fetching weekly sales history data' }, { status: 500 });
  }
}

console.log("Database Configuration:", {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ? '*****' : '(not set)',
    port: process.env.DB_PORT,
  });