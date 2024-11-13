import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: { rejectUnauthorized: false },
});

export async function POST(request: Request) {
  const { orders } = await request.json();

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const order of orders) {
        for (const item of order.items) {
          // First, get the food_id for the ordered item
          const foodResult = await client.query(
            'SELECT food_id FROM food WHERE food_name = $1',
            [item.name]
          );

          if (foodResult.rows.length === 0) {
            console.error(`Food item not found: ${item.name}`);
            continue;
          }

          const foodId = foodResult.rows[0].food_id;

          // Then, get all ingredients for this food item
          const ingredientsResult = await client.query(
            'SELECT ingredient_id FROM food_ingredients WHERE food_id = $1',
            [foodId]
          );

          // Decrement the quantity for each ingredient
          for (const row of ingredientsResult.rows) {
            await client.query(
              'UPDATE ingredients SET quantity = quantity - 1 WHERE ingredient_id = $1',
              [row.ingredient_id]
            );
          }
        }
      }

      await client.query('COMMIT');
      return NextResponse.json({ message: 'Inventory updated successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in transaction:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ message: 'Error updating inventory' }, { status: 500 });
  }
}