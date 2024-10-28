// app/managerView/page.tsx

"use client";
import { useState } from 'react';

export default function ManagerView() {
  const [activeTab, setActiveTab] = useState('X-Report');

  const handleTabChange = (tab: string) => setActiveTab(tab);

  return (
    <div className="flex screen w-full">

      {/* Header Panel: Main Tabs */}
      <div className="flex w-full space-x-4 mb-2 border-b pb-2">
        {['X-Report', 'Z-Report', 'Manage Inventory', 'Manage Employees', 'Inventory Usage'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}