"use client";

import { useEffect, useState } from "react";

type Day = {
  sales_day: string;
  total_order_sum: number;
};

export default function InventoryPage() {
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    fetch("/api/fetchPeakSalesDay")
      .then((response) => response.json())
      .then((data) => setDays(data.days))
      .catch((error) => console.error("Error fetching peak sales day history:", error));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-red-800 mb-8">Peak Sales Day History</h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {days.map((day) => (
          <div
            key={day.sales_day}
            className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{day.sales_day}</h2>
            <p className="text-gray-600"><strong>Total Revenue:</strong> {day.total_order_sum}</p>
          </div>
        ))}
      </div>
    </div>
  );
}