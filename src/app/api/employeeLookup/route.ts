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

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const query = 'SELECT employee_id, name, position, email FROM employees WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length > 0) {
      const employee = result.rows[0];
      return NextResponse.json({
        employeeId: employee.employee_id,
        name: employee.name,
        position: employee.position,
        email: employee.email
      });
    } else {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error looking up employee:', error);
    return NextResponse.json(
      { error: 'Error looking up employee data' },
      { status: 500 }
    );
  }
}

// Keep the GET method for fetching all employees
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM employees;');
    return NextResponse.json({ employees: result.rows });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Error fetching employees data' },
      { status: 500 }
    );
  }
}