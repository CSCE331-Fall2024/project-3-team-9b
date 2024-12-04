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

// GET all food items
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM food ORDER BY food_id ASC');
    return NextResponse.json({ items: result.rows });
  } catch (error) {
    console.error('Error fetching food items:', error);
    return NextResponse.json({ error: 'Error fetching food items' }, { status: 500 });
  }
}

// POST new food item
export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { food_id, food_name, quantity, type, calories, available, premium } = body;
  
      // Validate request body
      if (!food_id || !food_name || quantity === undefined || !type || calories === undefined || available === undefined || premium === undefined) {
        return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
      }
  
      const result = await pool.query(
        'INSERT INTO food (food_id, food_name, quantity, type, calories, available, premium) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [food_id, food_name, quantity, type, calories, available, premium]
      );
  
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      console.error('Error adding food item:', error);
      return NextResponse.json({ error: 'Failed to add food item' }, { status: 500 });
    }
  }

  

// DELETE food item
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { food_id } = body;

    const result = await pool.query(
      'DELETE FROM food WHERE food_id = $1 RETURNING *',
      [food_id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    return NextResponse.json({ error: 'Error deleting food item' }, { status: 500 });
  }
}

console.log("Database Configuration:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '*****' : '(not set)',
  port: process.env.DB_PORT,
});