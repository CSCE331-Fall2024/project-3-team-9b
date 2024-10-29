// app/customerView/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";


interface Size {
  size_id: number;
  size_name: string;
  price: number;
}

export default function CustomerView() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [error, setError] = useState<string | null>(null);


  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      {/* View Menu link at the top */}
      <Link href = "/menuBoardView" className="m-2 p-2 bg-red-600 text-white rounded hover:scale-105 hover:duration-300">View Menu</Link> 

      {/* Meal sizes */}
      <div className="flex flex-row space-x-4">
        {sizes.map((size) => (
          <button key={size.size_id} className="p-2 bg-blue-500 text-white rounded">
            {size.size_name} - ${size.price}
          </button>
        ))}
      </div>

      {/* Additional options for entrees/sides/appetizers */}
      <div className="flex flex-row space-x-4 mt-4 w-full justify-center">
        <Link href = "/sides" className="w-1/4 py-10 bg-red-600 text-white rounded hover:scale-105 hover:duration-300 text-center">Bowl</Link>
        <Link href = "/sides" className="w-1/4 py-10 bg-red-600 text-white rounded hover:scale-105 hover:duration-300 text-center">Plate</Link>
        <Link href = "/sides" className="w-1/4 py-10 bg-red-600 text-white rounded hover:scale-105 hover:duration-300 text-center">Bigger Plate</Link>
      </div>
    </div>
  );
}