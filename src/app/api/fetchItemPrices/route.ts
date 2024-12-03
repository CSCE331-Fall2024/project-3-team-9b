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
    const result = await pool.query('SELECT size_id, size_name, price FROM sizes ORDER BY size_id;');
    return NextResponse.json({ sizes: result.rows });
  } catch (error) {
    console.error('Error fetching item prices:', error);
    return NextResponse.json({ error: 'Error fetching item prices data' }, { status: 500 });
  }
}

console.log("Database Configuration:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '*****' : '(not set)',
  port: process.env.DB_PORT,
});