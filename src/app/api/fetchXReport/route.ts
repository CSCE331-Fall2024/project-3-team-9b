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
  // Get the current date in 'YYYY-MM-DD' format
  const transactionDate = new Date().toISOString().split('T')[0];

  try {
    const result = await pool.query(
      `WITH RankedEmployees AS (
         SELECT EXTRACT(HOUR FROM t.time) AS hour_of_day,
                e.name AS employee_name,
                COUNT(t.transaction_id) AS employee_orders,
                SUM(t.total_price) AS total_sales_for_hour,
                ROW_NUMBER() OVER (PARTITION BY EXTRACT(HOUR FROM t.time) ORDER BY COUNT(t.transaction_id) DESC) AS rank
         FROM transactions t
         JOIN employees e ON t.employee_id = e.employee_id
         WHERE t.transaction_date = $1
         GROUP BY hour_of_day, e.name
       ),
       HourlyTotals AS (
         SELECT EXTRACT(HOUR FROM t.time) AS hour_of_day,
                SUM(t.total_price) AS total_sales_for_hour
         FROM transactions t
         WHERE t.transaction_date = $1
         GROUP BY hour_of_day
       )
       SELECT r.hour_of_day, r.employee_name, r.employee_orders, h.total_sales_for_hour
       FROM RankedEmployees r
       JOIN HourlyTotals h ON r.hour_of_day = h.hour_of_day
       WHERE r.rank = 1
       ORDER BY r.hour_of_day;`,
      [transactionDate]
    );

    return NextResponse.json({ sides: result.rows });
  } catch (error) {
    console.error('Error fetching x report:', error);
    return NextResponse.json({ error: 'Error fetching x report data' }, { status: 500 });
  }
}

console.log("Database Configuration:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '*****' : '(not set)',
  port: process.env.DB_PORT,
});
