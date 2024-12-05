// app/customerView/page.tsx
'use client';
import {useEffect, useState } from 'react';
import Link from "next/link";
import Image  from 'next/image';
import { useShoppingDataContext } from '@components/shoppingData';
import WeatherWidget from '@components/WeatherWidget'; 
import ChatBot from '@components/ChatBot'; 
import ZoomSlider from "@components/ZoomSlider";


interface Size {
  size_id: number;
  size_name: string;
  price: number;
}
// const contentfulImageLoader: ImageLoader = ({ src, width }: ImageLoaderProps) => {
//   return `${src}?w=${width}`
// }

export default function CustomerView() {
  const [sizes, setSizes] = useState<Size[]>([]);


  const [shoppingData, changeShoppingData] = useShoppingDataContext();

  useEffect(() => {
    fetch('/api/fetchSizes')
    .then((res) => res.json())
    .then((data) => {setSizes(data.sizes); console.log(data.sizes)})
    
}, []);
  console.log(sizes);

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-red-800">
      <ZoomSlider />
      <div className="flex flex-col items-center w-full">
        {/* View Menu link at the top */}
        <Link href="/menuBoardView" className="px-6 py-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">View Menu</Link> 
        <h1 className="text-3xl font-bold text-white-800 mt-10">Choose your size</h1>

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
            <Link onClick={() => {
              if (size.size_id === 0){
                changeShoppingData({...shoppingData, numEntrees: 1, currentPrice: size.price, size: size.size_id});
              }
              else if (size.size_id === 1){
                changeShoppingData({...shoppingData, numEntrees: 2, currentPrice: size.price, size: size.size_id});
              }   
              else if (size.size_id === 2){
                changeShoppingData({...shoppingData, numEntrees: 3, currentPrice: size.price, size: size.size_id});
              }
              else if (size.size_id === 3){
                changeShoppingData({...shoppingData, numEntrees: 0, currentPrice: 0, size: size.size_id});
              }
            }} href = "/sides">
            {/* <Image src ={"/" + size.size_name + ".png"} width = {500} height = {500} alt = "sizes" className='w-full'/> */}
            <Image src = {size.size_name === 'bowl' ? "/TheOriginalOrangeChicken.png" : size.size_name === "plate" ? "/ChowMein.png" : "/" + size.size_name + ".png"} width = {500} height = {500} alt = "sizes" className='w-full'/>

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
      <WeatherWidget/>
      <ChatBot/>
    </div>
  );
}