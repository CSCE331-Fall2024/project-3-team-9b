"use client";

import { useEffect, useState } from "react";

type Week = {
  week_number: number;
  total_orders: number;
};

export default function InventoryPage() {
  const [weeks, setWeeks] = useState<Week[]>([]);

  useEffect(() => {
    fetch("/api/fetchWeeklySalesHistory")
      .then((response) => response.json())
      .then((data) => setWeeks(data.weeks))
      .catch((error) => console.error("Error fetching inventory:", error));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-red-800 mb-8">Inventory Directory</h1>
      <p className="text-lg text-gray-700 mb-12">Explore details of all ingredients below</p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {weeks.map((week) => (
          <div
            key={week.week_number}
            className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{week.week_number}</h2>
            <p className="text-gray-600"><strong>Quantity:</strong> {week.total_orders}</p>
          </div>
        ))}
      </div>
    </div>
  );
}