"use client";

import { useEffect, useState } from "react";

type XReport = {
  hour_of_day: number;
  employee_name: string;
  employee_orders: number;
  total_sales_for_hour: number;
};

export default function XReportPage() {
  const [xReport, setXReport] = useState<XReport[]>([]);

  useEffect(() => {
    fetch("/api/fetchXReport")
      .then((response) => response.json())
      .then((data) => setXReport(data.sides))
      .catch((error) => console.error("Error fetching X report:", error));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-red-800 mb-8">Daily X Report</h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {xReport.map((report) => (
          <div
            key={report.hour_of_day}
            className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Hour: {report.hour_of_day}</h2>
            <p className="text-gray-600"><strong>Top Employee:</strong> {report.employee_name}</p>
            <p className="text-gray-600"><strong>Orders Processed:</strong> {report.employee_orders}</p>
            <p className="text-gray-600"><strong>Total Sales for Hour:</strong> ${report.total_sales_for_hour.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
