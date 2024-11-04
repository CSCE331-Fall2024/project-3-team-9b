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
    const result = await pool.query('SELECT DATE(Transaction_Date) AS sales_day, SUM(Total_Price)::NUMERIC(10, 2) AS total_order_sum FROM Transactions GROUP BY sales_day ORDER BY total_order_sum DESC LIMIT 10;');
    return NextResponse.json({ days: result.rows });
  } catch (error) {
    console.error('Error fetching peak sales day history:', error); // This will give us more details about the error
    return NextResponse.json({ error: 'Error fetching peak sales day history data' }, { status: 500 });
  }
}

console.log("Database Configuration:", {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ? '*****' : '(not set)',
    port: process.env.DB_PORT,
  });