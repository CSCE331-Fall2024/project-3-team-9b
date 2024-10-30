'use client';
import { useEffect, useState } from 'react';

type Food = {
  food_id: number;
  food_name: string;
  quantity: number;
  type: string;
  calories: number;
  available: boolean;
  premium: boolean;
};

type ApiResponse = {
  sides?: Food[];
  entrees?: Food[];
  appetizers?: Food[];
  error?: string;
};

export default function CashierView() {
  const [activeTab, setActiveTab] = useState('sides');
  const [selectedSize, setSelectedSize] = useState<'Bowl' | 'Plate' | 'Bigger Plate' | null>(null);
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [items, setItems] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sizeLimits = {
    'Bowl': { sides: 1, entrees: 1 },
    'Plate': { sides: 1, entrees: 2 },
    'Bigger Plate': { sides: 1, entrees: 3 },
  };

  const itemPrices: { [key: string]: number } = {};

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let endpoint = '';
        if (activeTab === 'sides') {
          endpoint = '/api/fetchSides';
        } else if (activeTab === 'entrees') {
          endpoint = '/api/fetchEntrees';
        } else if (activeTab === 'appetizers') {
          endpoint = '/api/fetchAppetizers';
        }
  
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
  
        if (data.error) {
          throw new Error(data.error);
        }
  
        setItems(data.sides || data.entrees || data.appetizers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching items');
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, [activeTab]);
  

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setLoading(true);
    setError(null);
    setItems([]);
  };

  const handleSizeSelection = (size: 'Bowl' | 'Plate' | 'Bigger Plate') => {
    setSelectedSize(size);
    setCurrentOrder([]);
    setTotalCost(0);
  };

  const handleAddToOrder = (item: Food) => {
    if (!selectedSize) return;
  
    // Count the current sides and entrees in the order
    const sidesCount = currentOrder.filter((orderItem) => {
      const orderedItem = items.find(i => i.food_name === orderItem);
      return orderedItem?.type === 'side';
    }).length;
  
    const entreesCount = currentOrder.filter((orderItem) => {
      const orderedItem = items.find(i => i.food_name === orderItem);
      return orderedItem?.type === 'entree';
    }).length;
  
    // Debug statements to track counts and selected size
    console.log(`Current Order: ${JSON.stringify(currentOrder)}`);
    console.log(`Selected Size: ${selectedSize}`);
    console.log(`Sides Count: ${sidesCount}, Entrees Count: ${entreesCount}`);
  
    // Check if item exceeds the allowed sides or entrees for the selected size
    console.log("item type: " + item.type)
    if (
      (item.type === 'side' && sidesCount >= sizeLimits[selectedSize].sides) ||
      (item.type === 'entree' && entreesCount >= sizeLimits[selectedSize].entrees)
    ) {
      console.log(`Cannot add ${item.food_name}. Exceeds limit for ${item.type}.`);
      return;
    }
  
    // Calculate additional cost for premium items
    const additionalCost = item.premium ? 2 : 0;
  
    // Add item to order and update total cost
    setCurrentOrder([...currentOrder, item.food_name]);
    setTotalCost(totalCost + (itemPrices[item.food_name] || 0) + additionalCost);
    console.log(`Added ${item.food_name} to order. New Total: $${(totalCost + (itemPrices[item.food_name] || 0) + additionalCost).toFixed(2)}`);
  };
  

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100 border-r flex flex-col">
        <h2 className="text-lg text-blue-500 text-center font-bold mb-4">Current Transaction</h2>
        <ul className="space-y-2 flex-grow">
          {currentOrder.map((item, index) => (
            <li key={index} className="p-2 bg-white rounded shadow text-gray-800">
              {item} - ${(itemPrices[item] || 0).toFixed(2)}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-lg font-bold text-blue-600">Total: ${totalCost.toFixed(2)}</div>
      </div>

      <div className="flex-1 flex flex-col p-4">
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

        <div className="flex space-x-4 mb-4 border-b pb-2">
          {['Bowl', 'Plate', 'Bigger Plate'].map((size) => (
            <button
              key={size}
              className={`px-4 py-2 font-semibold ${
                selectedSize === size ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
              }`}
              onClick={() => handleSizeSelection(size as 'Bowl' | 'Plate' | 'Bigger Plate')}
            >
              {size}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8" role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <span className="sr-only">Loading...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8" role="alert">
            <div className="text-red-600 mb-4">Error loading items: {error}</div>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No items available at the moment.
          </div>
        )}

<div className="grid grid-cols-3 gap-4 mb-4">
          {!loading &&
            !error &&
            items.map((item) => {
              // Count current sides and entrees
              const sidesCount = currentOrder.filter((orderItem) => {
                const orderedItem = items.find(i => i.food_name === orderItem);
                return orderedItem?.type === 'side';
              }).length;

              const entreesCount = currentOrder.filter((orderItem) => {
                const orderedItem = items.find(i => i.food_name === orderItem);
                return orderedItem?.type === 'entree';
              }).length;

              const isDisabled = 
                !selectedSize ||
                (item.type === 'side' && sidesCount >= sizeLimits[selectedSize].sides) ||
                (item.type === 'entree' && entreesCount >= sizeLimits[selectedSize].entrees);

              return (
                <button
                  key={item.food_id}
                  className={`p-4 rounded ${
                    isDisabled
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  onClick={() => handleAddToOrder(item)}
                  disabled={isDisabled}
                >
                  {item.food_name} {item.premium && '(+ $2 Premium)'}
                </button>
              );
            })}
        </div>

        <div className="flex space-x-4 mt-auto">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => {
              setSelectedSize(null);
              setCurrentOrder([]);
              setTotalCost(0);
            }}
          >
            Reset Order
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => {/* Logic for completing the order */}}
          >
            Complete Order
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setCurrentOrder([])}
          >
            Clear Items
          </button>
        </div>
      </div>
    </div>
  );
}
