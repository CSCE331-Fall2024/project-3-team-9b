"use client";

import { useEffect, useState } from "react";

type Employee = {
  employee_id: number;
  name: string;
  gender: string;
  salary: number;
  position: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch("/api/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data.employees))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-red-800 mb-8">Employee Directory</h1>
      <p className="text-lg text-gray-700 mb-12">Explore details of all employees below</p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.employee_id}
            className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{employee.name}</h2>
            <p className="text-gray-600"><strong>Position:</strong> {employee.position}</p>
            <p className="text-gray-600"><strong>Gender:</strong> {employee.gender}</p>
            <p className="text-gray-600"><strong>Salary:</strong> ${employee.salary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
