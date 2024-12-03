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
  ssl: { rejectUnauthorized: false },
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

export async function POST(req: Request) {
  try {
    const { size_id, new_price } = await req.json();
    const updateResult = await pool.query(
      'UPDATE sizes SET price = $1 WHERE size_id = $2 RETURNING *;',
      [new_price, size_id]
    );
    
    if (updateResult.rows.length === 0) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }
    
    return NextResponse.json({ updatedSize: updateResult.rows[0] });
  } catch (error) {
    console.error('Error updating item price:', error);
    return NextResponse.json({ error: 'Error updating item price' }, { status: 500 });
  }
}