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
    const result = await pool.query('SELECT Food.Food_Name, COUNT(Ingredients.Ingredient_ID) AS total_ingredients_used FROM Food JOIN Food_Ingredients ON Food.Food_ID = Food_Ingredients.Food_ID JOIN Ingredients ON Food_Ingredients.Ingredient_ID = Ingredients.Ingredient_ID GROUP BY Food.Food_Name;');
    return NextResponse.json({ items: result.rows });
  } catch (error) {
    console.error('Error fetching menu item ingredient count:', error); // This will give us more details about the error
    return NextResponse.json({ error: 'Error fetching menu item ingredient count data' }, { status: 500 });
  }
}

console.log("Database Configuration:", {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ? '*****' : '(not set)',
    port: process.env.DB_PORT,
  });