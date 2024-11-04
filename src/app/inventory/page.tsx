"use client";

import { useEffect, useState } from "react";

type Ingredient = {
  ingredient_id: number;
  ingredient_name: string;
  quantity: number;
};

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    fetch("/api/fetchInventory")
      .then((response) => response.json())
      .then((data) => setIngredients(data.ingredients))
      .catch((error) => console.error("Error fetching inventory:", error));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-red-800 mb-8">Inventory Directory</h1>
      <p className="text-lg text-gray-700 mb-12">Explore details of all ingredients below</p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.ingredient_id}
            className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{ingredient.ingredient_name}</h2>
            <p className="text-gray-600"><strong>Quantity:</strong> {ingredient.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}