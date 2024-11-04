"use client";

import { useEffect, useState } from "react";

type Hour = {
  hour_of_day: number;
  total_orders: number;
  total_order_sum: number;
};

export default function InventoryPage() {
  const [hours, setHours] = useState<Hour[]>([]);

  useEffect(() => {
    fetch("/api/fetchRealisticSalesHistory")
      .then((response) => response.json())
      .then((data) => setHours(data.hours))
      .catch((error) => console.error("Error fetching realistic sales history:", error));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-red-800 mb-8">Realistic Sales History</h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {hours.map((hour) => (
          <div
            key={hour.hour_of_day}
            className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{hour.hour_of_day}</h2>
            <p className="text-gray-600"><strong>Orders Processed:</strong> {hour.total_orders}</p>
            <p className="text-gray-600"><strong>Total Revenue:</strong> {hour.total_order_sum}</p>
          </div>
        ))}
      </div>
    </div>
  );
}