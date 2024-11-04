"use client";

import { useEffect, useState } from "react";

type Item = {
  food_name: string;
  total_ingredients_used: number;
}

export default function ItemIngredientCountPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/fetchItemIngredientCount")
      .then((response) => response.json())
      .then((data) => setItems(data.items))
      .catch((error) => console.error("Error fetching item ingredient count:", error));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-red-800 mb-8">Menu Item Ingredient Count</h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.food_name}
            className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{item.food_name}</h2>
            <p className="text-gray-600"><strong>Ingredients Used:</strong> {item.total_ingredients_used}</p>
          </div>
        ))}
      </div>
    </div>
  );
}