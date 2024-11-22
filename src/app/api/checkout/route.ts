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
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const foodName = await request.json();
      console.log(foodName);
      for (const food of foodName){
        const result = await client.query(
          'UPDATE food SET quantity = quantity - 1 WHERE food_name = $1',
          [food]
        );
        if (result.rowCount === 0) {
          throw new Error(`Food with name ${food} not found`);
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