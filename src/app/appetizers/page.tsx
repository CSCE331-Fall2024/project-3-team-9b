'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";

export default function CustomerView() {

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      {/* View Menu link at the top */}
      <Link href = "/menuBoardView" className="m-2 p-2 bg-red-600 text-white rounded hover:scale-105 hover:duration-300">View Menu</Link> 

      {/* Additional options for entrees/sides/appetizers */}
      <div className="flex flex-row space-x-4 mt-4 w-full justify-center">
        <Link href = "/" className="w-1/4 py-10 bg-red-600 text-white rounded hover:scale-105 hover:duration-300 text-center">Apps</Link>
    
      </div>
    </div>
  );
}