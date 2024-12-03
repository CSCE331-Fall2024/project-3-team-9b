// import { defaultConfig } from 'next/dist/server/config-shared';
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
  const client = await pool.connect();
  try {
    const { employee, cart, totalPrice, size } = await request.json();
    await client.query('BEGIN');
    // console.log(request.json);
    //   console.log(cart);
    //   console.log(employee);
    //   console.log(totalPrice);

    for (const food of cart) {
      const foodname = food.replace("/p", "").replace("/e", "").replace("/a", "").replace("/d", "");
      await client.query(
        'UPDATE food SET quantity = quantity - 1 WHERE food_name = $1 AND quantity > 0',
        [foodname]
      );
    }
    const query = await client.query('SELECT MAX(transaction_id) FROM transactions');
    const transactionId = query.rows[0].max + 1;
    await client.query(
      'INSERT INTO transactions (transaction_id, employee_id, typesales, transaction_date, time, total_price, size_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [transactionId, employee, 'Order Transaction', new Date(), new Date(), totalPrice, size]
    );

    // const lastOrderResult = await client.query('SELECT MAX(order_id) AS last_order_id FROM orders');
    //   let newOrderId = (lastOrderResult.rows[0].last_order_id || 0) + 1;

    //   // Insert each order into orders table
    //     for (const item of cart) {
    //       const foodname = item.replace("/p", "").replace("/e", "").replace("/a", "").replace("/d", "");
    //       const foodItem = await client.query('SELECT food_id FROM food WHERE food_name = $1', [foodname]);
    //       if (foodItem.rows.length === 0) {
    //         throw new Error(`Food item not found: ${item.name}`);
    //       }
    //       // Insert into orders with manually incremented order_id
    //       await client.query(
    //         'INSERT INTO orders (order_id, transaction_id, food_id, price) VALUES ($1, $2, $3, $4)',
    //         [newOrderId++, transactionId, foodItem.rows[0], totalPrice]
    //       );
    //     }

    await client.query('COMMIT');

    return NextResponse.json({ message: request.json}, { status: 200 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during checkout:', error);
    return NextResponse.json({ message: 'Checkout failed'}, { status: 500 });
  } finally {
    client.release();
  }
}

// export async function POST(request: Request) {
//   try {
//     const client = await pool.connect();
//     try {
//       await client.query('BEGIN');
//       const {employee ,cart, totalPrice} = await request.json();
//       // console.log(cart);
//       for (const food of cart){
//         const foodname = food.replace("/p", "").replace("/e", "").replace("/a", "").replace("/d", "")
//         const result = await client.query(
//           'UPDATE food SET quantity = quantity - 1 WHERE food_name = $1',
//           [foodname]
//         );
//         if (result.rowCount === 0) {
//           throw new Error(`Food with name ${food} not found`);
//         }
//       }
//       await client.query(
//         'INSERT INTO transactions (employee_id, typesales, transaction_date, time, total_price, size_id) VALUES ($1, $2, $3, $4, $5, $6)',
//         [employee, 'Order Transaction', new Date(), new Date(), totalPrice, 1]
//       );
//       // client.query
//       await client.query('COMMIT');
//       return NextResponse.json({ message: 'Inventory updated successfully' });
//     } catch (error) {
//       await client.query('ROLLBACK');
//       console.error('Error in transaction:', error);
//       throw error;
//     } finally {
//       client.release();
//     }
//   } catch (error) {
//     console.error('Error updating inventory:', error);
//     return NextResponse.json({ message: 'Error updating inventory' }, { status: 500 });
//   }
// }