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
  // Ensure the current date is formatted correctly
  const transactionDate = '2024-08-10'; // Hardcode or dynamically determine the date for testing

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
      [transactionDate] // Pass the parameter here
    );

    // Format total_sales_for_hour as a dollar amount with two decimal places
    const formattedResult = result.rows.map(row => ({
      ...row,
      total_sales_for_hour: `${parseFloat(row.total_sales_for_hour).toFixed(2)}`, // Format as a string
    }));

    return NextResponse.json({ sides: formattedResult });
  } catch (error) {
    console.error('Error fetching X-Report:', error);
    return NextResponse.json({ error: 'Error fetching X-Report data' }, { status: 500 });
  }
}


console.log("Database Configuration:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '*****' : '(not set)',
  port: process.env.DB_PORT,
});
