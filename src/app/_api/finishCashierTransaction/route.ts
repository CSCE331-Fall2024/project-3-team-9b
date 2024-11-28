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

// Export the POST method for handling the transaction
export async function POST(req: Request) {
  try {
    const { employeeId, orders, totalPrice } = await req.json();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get the last transaction_id and increment it
      const lastTransactionResult = await client.query('SELECT MAX(transaction_id) AS last_transaction_id FROM transactions');
      const newTransactionId = (lastTransactionResult.rows[0].last_transaction_id || 0) + 1;

      // Insert transaction into transactions table
      await client.query(
        'INSERT INTO transactions (transaction_id, employee_id, typesales, transaction_date, time, total_price, size_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [newTransactionId, employeeId, 'Order Transaction', new Date(), new Date(), totalPrice, getSizeId(orders[0].size)]
      );

      // Get the last order_id and increment it
      const lastOrderResult = await client.query('SELECT MAX(order_id) AS last_order_id FROM orders');
      let newOrderId = (lastOrderResult.rows[0].last_order_id || 0) + 1;

      // Insert each order into orders table
      for (const order of orders) {
        for (const item of order.items) {
          const foodItem = await client.query('SELECT food_id FROM food WHERE food_name = $1', [item.name]);
          if (foodItem.rows.length === 0) {
            throw new Error(`Food item not found: ${item.name}`);
          }
          const foodId = foodItem.rows[0].food_id;
          const price = item.premium || item.type === 'appetizer' ? 2 : 0;

          // Insert into orders with manually incremented order_id
          await client.query(
            'INSERT INTO orders (order_id, transaction_id, food_id, price) VALUES ($1, $2, $3, $4)',
            [newOrderId++, newTransactionId, foodId, price]
          );
        }
      }

      await client.query('COMMIT');
      return NextResponse.json({ message: 'Transaction submitted successfully', transactionId: newTransactionId });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error submitting transaction:', error);
    return NextResponse.json({ message: 'Failed to submit transaction' }, { status: 500 });
  }
}

function getSizeId(size: string): number {
  switch (size) {
    case 'Bowl':
      return 0;
    case 'Plate':
      return 1;
    case 'Bigger Plate':
      return 2;
    case 'A La Carte':
      return 3;
    default:
      throw new Error('Invalid size');
  }
}