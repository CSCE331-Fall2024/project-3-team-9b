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
  ssl: { rejectUnauthorized: false }, // Adjust SSL based on your setup
});

export async function GET() {
    const transactionDate = '2024-08-10'; // Replace this with a valid date or make it dynamic
    console.log('Fetching Z-Report for date:', transactionDate);
  
    try {
      const result = await pool.query(
        `
        WITH DaySummary AS (
          SELECT
            e.name AS employee_name,
            COUNT(t.transaction_id) AS employee_orders,
            SUM(t.total_price) AS total_sales,
            ROW_NUMBER() OVER (ORDER BY COUNT(t.transaction_id) DESC) AS rank
          FROM transactions t
          JOIN employees e ON t.employee_id = e.employee_id
          WHERE t.transaction_date = $1
          GROUP BY e.name
        ),
        TotalSalesForDay AS (
          SELECT SUM(total_price) AS total_sales_for_day
          FROM transactions
          WHERE transaction_date = $1
        )
        SELECT 
          d.employee_name, 
          d.employee_orders, 
          d.total_sales, 
          t.total_sales_for_day
        FROM DaySummary d
        CROSS JOIN TotalSalesForDay t
        WHERE d.rank = 1;
        `,
        [transactionDate]
      );
  
      console.log('Query Result:', result.rows);
  
      if (result.rows.length > 0) {
        return NextResponse.json({ zReport: result.rows });
      } else {
        console.warn('No transactions found for the given date:', transactionDate);
        return NextResponse.json({ message: 'No transactions found for the given date.' });
      }
    } catch (error) {
      console.error('Error fetching Z-Report:', error);
      return NextResponse.json({ error: 'Error fetching Z-Report data' }, { status: 500 });
    }
  }
  