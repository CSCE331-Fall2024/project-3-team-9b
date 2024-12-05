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
  const transactionDate = '2024-08-10'; // Replace with a dynamic date if needed
  console.log('Fetching Z-Report for date:', transactionDate);

  try {
    const query = `
      WITH HourlyBreakdown AS (
        SELECT
          e.name AS employee_name,
          EXTRACT(HOUR FROM t.time) AS hour_of_day,
          COUNT(t.transaction_id) AS employee_orders,
          SUM(t.total_price) AS total_sales
        FROM transactions t
        JOIN employees e ON t.employee_id = e.employee_id
        WHERE t.transaction_date = $1
        GROUP BY e.name, hour_of_day
        ORDER BY hour_of_day, e.name
      ),
      DailyTotals AS (
        SELECT
          SUM(total_price) AS total_sales_for_day,
          COUNT(transaction_id) AS total_orders_for_day
        FROM transactions
        WHERE transaction_date = $1
      )
      SELECT
        hb.hour_of_day,
        hb.employee_name,
        hb.employee_orders,
        hb.total_sales,
        dt.total_sales_for_day,
        dt.total_orders_for_day
      FROM HourlyBreakdown hb
      CROSS JOIN DailyTotals dt;
    `;

    console.log('Executing query:', query);

    const result = await pool.query(query, [transactionDate]);

    console.log('Query Result:', result.rows);

    if (result.rows.length > 0) {
      return NextResponse.json({ zReport: result.rows });
    } else {
      console.warn('No transactions found for the given date:', transactionDate);
      return NextResponse.json({ message: 'No transactions found for the given date.' });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching Z-Report:', error.message);
      console.error('Stack Trace:', error.stack);
      return NextResponse.json({ error: 'Error fetching Z-Report data' }, { status: 500 });
    } else {
      console.error('Unexpected error type:', error);
      return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}
