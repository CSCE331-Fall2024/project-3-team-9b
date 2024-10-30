// app/cashierView/page.tsx

"use client";
import { useState } from 'react';

export default function CashierView() {
  const [activeTab, setActiveTab] = useState('entrees');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  // These are hard coded right now, but will add db connection to pull actual prices
  const itemPrices: { [key: string]: number } = {
    'Side 1': 0,
    'Side 2': 0,
    'Side 3': 0,
    'Entree 1': 0,
    'Entree 2': 0,
    'Entree 3': 0,
    'Appetizer 1': 0,
    'Appetizer 2': 0,
    'Appetizer 3': 0,
  };

  const handleTabChange = (tab: string) => setActiveTab(tab);
  const handleSizeSelection = (size: string) => setSelectedSize(size);
  const handleAddToOrder = (item: string) => {
    setCurrentOrder([...currentOrder, item]);
    setTotalCost(totalCost + itemPrices[item]);
  };
  const handleReset = () => {
    setSelectedSize(null);
    setCurrentOrder([]);
    setTotalCost(0);
  };

  // Logic to complete current order
  const handleComplete = () => {};

  // Logic to finish total transaction
  const handleFinish = () => {/* Logic to complete transaction */};

  return (
    <div className="flex h-screen">
      
      {/* Left Panel: Current Order List */}
      <div className="w-1/4 p-4 bg-gray-100 border-r flex flex-col">
        <h2 className="text-lg text-blue-500 text-center font-bold mb-4">Current Transaction</h2>
        
        {/* List of items with flex-grow to push total cost to bottom */}
        <ul className="space-y-2 flex-grow">
          {currentOrder.map((item, index) => (
            <li key={index} className="p-2 bg-white rounded shadow text-gray-800">
              {item} - ${itemPrices[item].toFixed(2)}
            </li>
          ))}
        </ul>

        
        {/* Total Cost Display at the Bottom */}
        <div className="mt-4 text-lg font-bold text-blue-600">
          Total: ${totalCost.toFixed(2)}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col p-4">
        
        {/* Header Panel: Main Tabs */}
        <div className="flex space-x-4 mb-2 border-b pb-2">
          {['sides', 'entrees', 'appetizers'].map((tab) => (
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

        {/* Sub-Header Panel: Size Selection */}
        <div className="flex space-x-4 mb-4 border-b pb-2">
          {['Bowl', 'Plate', 'Bigger Plate'].map((size) => (
            <button
              key={size}
              className={`px-4 py-2 font-semibold ${
                selectedSize === size ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
              }`}
              onClick={() => handleSizeSelection(size)}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Grid Section for Menu Items (hard coded items to display layout, will add menu items from db) */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {(activeTab === 'sides' ? ['Side 1', 'Side 2', 'Side 3'] :
            activeTab === 'entrees' ? ['Entree 1', 'Entree 2', 'Entree 3'] :
            ['Appetizer 1', 'Appetizer 2', 'Appetizer 3']
          ).map((item) => (
            <button
              key={item}
              className={`p-4 rounded hover:bg-blue-600 ${selectedSize ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              onClick={() => selectedSize && handleAddToOrder(item)}
              disabled={!selectedSize}  // Disable button if no size is selected
            >
              {item}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-auto">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={handleReset}
          >
            Reset Order
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleComplete}
          >
            Complete Order
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleFinish}
          >
            Finish Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
