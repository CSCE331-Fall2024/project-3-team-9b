import { NextRequest, NextResponse } from 'next/server';
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


export async function GET(req: NextRequest) {
  try {
    const result = await pool.query('SELECT Employee_ID, Name, Gender, Salary, Position, Email FROM Employees;');
    return new NextResponse(JSON.stringify({ employees: result.rows }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

// Handle POST requests to add new employees
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, gender, salary, position, email } = data;

    if (!name || !gender || !salary || !position || !email) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    
    const idResult = await pool.query('SELECT MAX(Employee_ID) as max_id FROM Employees');
    const nextId = (idResult.rows[0].max_id || 16) + 1;  

    const query = 'INSERT INTO Employees (Employee_ID, Name, Gender, Salary, Position, Email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
    const values = [nextId, name, gender, salary, position, email];
    const result = await pool.query(query, values);

    return new NextResponse(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to add employee' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}
