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
      <Link href = "/menuBoardView" className="px-6 py-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">View Menu</Link> 

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
        <Link href = "/sides" className="w-1/4 py-10 bg-white rounded-lg shadow-lg text-gray-800 hover:scale-105 hover:duration-300 hover:bg-gray-100 text-center">
          <img src = "/Bowl.png"></img>
          <div className='text-2xl font-bold'>Bowl</div>
          <div className='mt-4'>1 Side & 1 Entree</div>
          <div>$8.30+</div>
          
        </Link>
        <Link href = "/sides" className="w-1/4 py-10 bg-white text-gray-800 rounded-lg shadow-lg hover:scale-105 hover:duration-300 hover:bg-gray-100 text-center">
          <img src = "/Plate.png"></img>
          <div className='text-2xl font-bold'>Plate</div>
          <div className='mt-4'>1 Side & 2 Entrees</div>
          <div>$9.80+</div>
        </Link>

        <Link href = "/sides" className="w-1/4 py-10 bg-white  text-gray-800 rounded-lg shadow-lg hover:scale-105 hover:duration-300 hover:bg-gray-100 text-center">
          <img src = "/BiggerPlate.png"></img>
          <div className='text-2xl font-bold'>Bigger Plate</div>
          <div className='mt-4'>1 Side & 3 Entrees</div>
          <div>$11.30+</div>
        </Link>
      </div>
    </div>
  );
}