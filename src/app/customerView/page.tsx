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

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/fetchSizes');
      const data = await response.json();
      setSizes(data.sizes);
      // console.log(sizes);
    }
    
    catch (error) {
      setError('Failed to fetch sizes');
    }
  }
  useEffect(() => {
    fetchSizes();
  },[]);
  // console.log(sizes);
  return (
    <div className="flex flex-col items-center h-screen rounded-full bg-red-800 mb-40">
      {/* View Menu link at the top */}
      <Link href = "/menuBoardView" className="px-6 py-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">View Menu</Link> 
      <h1 className="text-3xl font-bold text-gray-800 mt-10">Choose your size</h1>

      {/* Meal sizes */}
      {/* <div className="flex flex-row space-x-4">
        {sizes.map((size) => (
          <button key={size.size_id} className="p-2 bg-blue-500 text-white rounded">
            {size.size_name} - ${size.price}
          </button>
        ))}
      </div> */}

      {/* Additional options for entrees/sides/appetizers */}
      <div className="flex flex-row mx-10 gap-4 flex-wrap mt-4 w-full justify-center">
        
        {sizes.map((size)=> (
          <div key={size.size_id} className="h-[400px] w-[400px] py-10 bg-white rounded-lg shadow-lg text-gray-800 hover:scale-105 hover:duration-300 hover:bg-gray-100 text-center">
            <Link onClick={() => {localStorage.setItem("currentPrice", String(size.price));
              if (size.size_id === 0){
                localStorage.setItem("numSides", "1");
                localStorage.setItem("numEntrees", "1");
              }
              else if (size.size_id === 1){
                localStorage.setItem("numSides", "1");
                localStorage.setItem("numEntrees", "2");
              }
              else if (size.size_id === 2){
                localStorage.setItem("numSides", "1");
                localStorage.setItem("numEntrees", "3");
              }
            }} href = "/sides">
            <img src ={"/" +size.size_name + ".png"} ></img>
            <div className='text-2xl font-bold'>{size.size_name[0].toUpperCase() + size.size_name.substring(1).replaceAll("_", " ")}</div>
            <div className='mt-4'>{size.size_id === 0 ? `1 Side & 1 Entree`: size.size_id == 1 ? "1 Side & 2 Entrees" : size.size_id === 2 ? "1 Side & 3 Entrees" : ""}</div>
            <div>${String(size.price)}+</div>
            </Link>
            </div>
        ))}
        {/* <Link onClick={() => localStorage.setItem("currentPrice", "9.8")} href = "/sides" className="w-1/4 py-10 bg-white text-gray-800 rounded-lg shadow-lg hover:scale-105 hover:duration-300 hover:bg-gray-100 text-center">
          <img src = "/Plate.png"></img>
          <div className='text-2xl font-bold'>Plate</div>
          <div className='mt-4'>1 Side & 2 Entrees</div>
          <div>$9.80+</div>
        </Link>

        <Link onClick={() => localStorage.setItem("currentPrice", "11.3")} href = "/sides" className="w-1/4 py-10 bg-white  text-gray-800 rounded-lg shadow-lg hover:scale-105 hover:duration-300 hover:bg-gray-100 text-center">
          <img src = "/BiggerPlate.png"></img>
          <div className='text-2xl font-bold'>Bigger Plate</div>
          <div className='mt-4'>1 Side & 3 Entrees</div>
          <div>$11.30+</div>
        </Link> */}
      </div>
    </div>
  );
}