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
  const [currentOrder, setCurrentOrder] = useState<Food[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [items, setItems] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sizeLimits = {
    'Bowl': { sides: 1, entrees: 1 },
    'Plate': { sides: 1, entrees: 2 },
    'Bigger Plate': { sides: 1, entrees: 3 },
  };

  const basePrices: { [key: string]: number } = {
    'Bowl': 8.30,
    'Plate': 9.80,
    'Bigger Plate': 11.30,
  };

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
    setTotalCost(basePrices[size]);
  };

  const handleAddToOrder = (item: Food) => {
    if (!selectedSize) return;

    const sidesCount = currentOrder.filter(i => i.type === 'side').length;
    const entreesCount = currentOrder.filter(i => i.type === 'entree').length;

    if (
      (item.type === 'side' && sidesCount >= sizeLimits[selectedSize].sides) ||
      (item.type === 'entree' && entreesCount >= sizeLimits[selectedSize].entrees)
    ) {
      return;
    }

    const additionalCost = item.premium ? 2 : 0;
    const appetizersExtraCost = item.type === 'appetizer' ? 2 : 0;

    setCurrentOrder([...currentOrder, item]);
    setTotalCost(totalCost + additionalCost + appetizersExtraCost);
  };

  const handleSubmitOrder = () => {
    alert('Order submitted: ' + currentOrder.map(item => item.food_name).join(', '));
  };

  const handleFinishTransaction = () => {
    alert('Transaction finished! All orders will be saved.');
  };

  const handleReset = () => {
    setSelectedSize(null);
    setCurrentOrder([]);
    setTotalCost(0);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100 border-r flex flex-col">
        <h2 className="text-lg text-blue-500 text-center font-bold mb-4">Current Transaction</h2>
        {selectedSize && <div className="text-lg font-semibold text-blue-600">{selectedSize}</div>}
        <ul className="space-y-2 flex-grow">
          {currentOrder.map((item, index) => {
            const itemBasePrice = basePrices[selectedSize || 'Bowl'] || 0;
            const additionalCost = item.premium ? 2 : 0;
            const appetizersExtraCost = item.type === 'appetizer' ? 2 : 0;

            return (
              <li key={index} className="p-2 bg-white rounded shadow text-gray-800">
                {item.food_name}
                {itemBasePrice > 0 && (
                  <span className="text-gray-500">
                    {' - $' + (itemBasePrice + additionalCost + appetizersExtraCost).toFixed(2)}
                  </span>
                )}
                {item.premium && (
                  <span className="text-red-500 text-sm ml-2">(Extra fee: $2.00)</span>
                )}
                {item.type === 'appetizer' && (
                  <span className="text-red-500 text-sm ml-2">(Extra fee: $2.00)</span>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-4 text-lg font-bold text-blue-600">Total: ${totalCost.toFixed(2)}</div>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <div className="flex space-x-4 mb-2 border-b pb-2">
          {['sides', 'entrees', 'appetizers'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-semibold ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
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
                selectedSize === size
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : selectedSize
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500'
              }`}
              onClick={() => !selectedSize && handleSizeSelection(size as 'Bowl' | 'Plate' | 'Bigger Plate')}
              disabled={!!selectedSize && selectedSize !== size}
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
              const sidesCount = currentOrder.filter(i => i.type === 'side').length;
              const entreesCount = currentOrder.filter(i => i.type === 'entree').length;

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
                  {item.food_name} 
                  {item.premium && '(+ $2 Premium)'}
                  {item.type === 'appetizer' && '(+ $2 Extra)'}
                </button>
              );
            })}
        </div>

        <div className="flex space-x-4 mt-auto">
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-300"
            onClick={handleReset}
          >
            Reset Order
          </button>
          <button
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 text-white"
            onClick={handleSubmitOrder}
          >
            Submit Order
          </button>
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-400 text-white"
            onClick={handleFinishTransaction}
          >
            Finish Transaction
          </button>
        </div>
      </div>
    </div>
  );
}