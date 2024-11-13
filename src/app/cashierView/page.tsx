'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";

type Food = {
  food_id: number;
  food_name: string;
  quantity: number;
  type: string;
  calories: number;
  available: boolean;
  premium: boolean;
};

type OrderItem = {
  name: string;
  type: string;
  premium: boolean;
};

type ApiResponse = {
  sides?: Food[];
  entrees?: Food[];
  appetizers?: Food[];
  drinks?: Food[];
  error?: string;
};

type Ingredient = {
  ingredient_id: number;
  amount_used: number;
};

export default function CashierView() {
  const [activeTab, setActiveTab] = useState('sides');
  const [selectedSize, setSelectedSize] = useState<'Bowl' | 'Plate' | 'Bigger Plate' | 'A La Carte' | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [previousOrders, setPreviousOrders] = useState<Array<{ size: string, items: OrderItem[], subtotal: number }>>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [currentOrderSubtotal, setCurrentOrderSubtotal] = useState(0);
  const [items, setItems] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isALaCarte, setIsALaCarte] = useState(false);

  const sizeLimits = {
    'Bowl': { sides: 1, entrees: 1 },
    'Plate': { sides: 1, entrees: 2 },
    'Bigger Plate': { sides: 1, entrees: 3 },
    'A La Carte' : { sides: 10000, entrees: 10000},
  };

  const basePrices: { [key: string]: number } = {
    'Bowl': 8.30,
    'Plate': 9.80,
    'Bigger Plate': 11.30,
    'A La Carte' : 0.0,
  };

  const aLaCartPrices: { [key: string]: number } = {
    'side' : 4.40,
    'entree' : 5.20,
    'drink' : 0.0,
    'appetizer' : 0.0,
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
        } else if (activeTab === 'drinks') {
          endpoint = '/api/fetchDrinks';
        }
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        const processedItems = (data.sides || data.entrees || data.appetizers || data.drinks || []).map(item => ({
          ...item,
          available: item.quantity > 0
        }));
        setItems(processedItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching items');
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, [activeTab]);

  // switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setLoading(true);
    setError(null);
    setItems([]);
  };

  // choose size for order
  const handleSizeSelection = (size: 'Bowl' | 'Plate' | 'Bigger Plate' | 'A La Carte') => {
    setSelectedSize(size);
    setIsALaCarte(size === 'A La Carte');
    setCurrentOrder([]);
    setCurrentOrderSubtotal(basePrices[size]);
    setTotalCost(prevTotal => prevTotal + basePrices[size]);

  };

  const handleAddToOrder = (item: Food) => {
    if (!selectedSize || !item.available) return;

    const sidesCount = currentOrder.filter(i => i.type === 'side').length;
    const entreesCount = currentOrder.filter(i => i.type === 'entree').length;

    // check if at the sides/entree limit
    if ((item.type === 'side' && sidesCount >= sizeLimits[selectedSize].sides) 
      || (item.type === 'entree' && entreesCount >= sizeLimits[selectedSize].entrees)) 
    {
      return;
    }

    let aLaCartePrice = 0;
    // add a la cart pricing
    if (isALaCarte) {
      aLaCartePrice = aLaCartPrices[item.type];
    }

    // set other additional costs
    const additionalCost = item.premium ? 2 : 0;
    const appetizerCost = item.type === 'appetizer' ? 2 : 0;
    const drinkCost = item.type === 'drink' ? 2 : 0;
    const itemCost = additionalCost + appetizerCost + drinkCost + aLaCartePrice;

    setCurrentOrder([...currentOrder, { name: item.food_name, type: item.type, premium: item.premium }]);
    setCurrentOrderSubtotal(prevSubtotal => prevSubtotal + itemCost);
    setTotalCost(prevTotal => Number((prevTotal + itemCost).toFixed(2)));
  };

  const handleSubmitOrder = () => {
    const sidesCount = currentOrder.filter(i => i.type === 'side').length;
    const entreesCount = currentOrder.filter(i => i.type === 'entree').length;

    if (!selectedSize) return;
    
    // make sure items are selected for order
    if (currentOrder.length == 0) {
      alert('Please add items to your order before submitting.');
    }

    // ensure sides limit has been reached
    else if (sidesCount == sizeLimits[selectedSize].sides && entreesCount == sizeLimits[selectedSize].entrees || isALaCarte) {
      alert('Order submitted: ' + currentOrder.map(item => item.name).join(', ') + ' - Subtotal: $' + currentOrderSubtotal.toFixed(2));
      setPreviousOrders([...previousOrders, { size: selectedSize!, items: currentOrder, subtotal: currentOrderSubtotal }]);
      setSelectedSize(null);
      setCurrentOrder([]);
      setCurrentOrderSubtotal(0);
    } 
    // alert user to select more options
    else if (sidesCount < sizeLimits[selectedSize].sides) {
      alert('You must select more sides to complete the order.')
    }
    else {
      alert('You must select more entrees to complete the order.')
    }
  };

  const handleFinishTransaction = async () => {
    if (previousOrders.length === 0 && currentOrder.length === 0) {
      alert('No orders to submit.');
      return;
    }

    const employeeId = prompt('Please enter your employee ID:');
    if (!employeeId) {
      alert('Employee ID is required to finish the transaction.');
      return;
    }

    try {
      const response = await fetch('/api/finishCashierTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          orders: [...previousOrders, { size: selectedSize!, items: currentOrder, subtotal: currentOrderSubtotal }],
          totalPrice: totalCost,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit transaction');
      }

      const result = await response.json();
      alert(`Transaction finished! Transaction ID: ${result.transactionId}`);

      // update inventory ingredients quantity
      const inventoryResponse = await fetch('/api/decrementIngredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orders: [...previousOrders, { size: selectedSize!, items: currentOrder, subtotal: currentOrderSubtotal }],
        }),
      });

      if (!inventoryResponse.ok) {
        throw new Error('Failed to update inventory');
      }

      // reset the state
      setPreviousOrders([]);
      setSelectedSize(null);
      setCurrentOrder([]);
      setTotalCost(0);
      setCurrentOrderSubtotal(0);
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Failed to submit transaction. Please try again.');
    }
  };

  const handleReset = () => {
    setSelectedSize(null);
    setCurrentOrder([]);
    setTotalCost(prevTotal => prevTotal - currentOrderSubtotal);
    setCurrentOrderSubtotal(0);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100 border-r flex flex-col">
        <h2 className="text-xl text-blue-500 text-center font-bold mb-4">Current Transaction</h2>
        {previousOrders.map((order, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold text-gray-700">Order {index + 1} - {order.size}</h3>
            <ul className="pl-4">
              {order.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-600">
                  {item.name}
                  {item.premium && <span className="text-red-500 text-sm ml-2">(Extra fee: $2.00)</span>}
                  {item.type === 'appetizer' && <span className="text-red-500 text-sm ml-2">(Extra fee: $2.00)</span>}
                  {item.type === 'drink' && <span className="text-red-500 text-sm ml-2">(Extra fee: $2.00)</span>}
                </li>
              ))}
            </ul>
            <div className="text-right text-gray-600">Subtotal: ${order.subtotal.toFixed(2)}</div>
          </div>
        ))}
        {selectedSize && <div className="text-lg font-semibold text-blue-600">{selectedSize}</div>}
        <ul className="space-y-2 flex-grow">
          {currentOrder.map((item, index) => (
            <li key={index} className="p-2 bg-white rounded shadow text-gray-800">
              {item.name}
              {item.premium && (
                <span className="text-red-500 text-sm ml-2">(Extra fee: $2.00)</span>
              )}
              {item.type === 'appetizer' && (
                <span className="text-red-500 text-sm ml-2">(Extra fee: $2.00)</span>
              )}
              {item.type === 'drink' && (
                <span className="text-red-500 text-sm ml-2">(Extra fee: $2.00)</span>
              )}
            </li>
          ))}
        </ul>
        {currentOrder.length > 0 && (
          <div className="mt-2 text-right font-bold text-blue-500">Current Order Subtotal: ${currentOrderSubtotal.toFixed(2)}</div>
        )}
        <div className="mt-4 text-right text-lg font-bold text-blue-600">Total: ${totalCost.toFixed(2)}</div>
      </div>

      <div className="flex-1 flex flex-col p-4 bg-red-400">
      <div className="flex justify-center mb-2 border-b pb-2">
        <div className="flex space-x-4">
          {['sides', 'entrees', 'appetizers', 'drinks'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-semibold text-lg ${
                activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-white-500'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center mb-4 border-b pb-2">
        <div className="flex space-x-4">
          {['Bowl', 'Plate', 'Bigger Plate', 'A La Carte'].map((size) => (
            <button
              key={size}
              className={`px-4 py-2 font-semibold ${
                selectedSize === size
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : selectedSize
                  ? 'text-gray-300 text-opacity-70 cursor-not-allowed'
                  : 'text-white-500'
              }`}
              onClick={() => !selectedSize && handleSizeSelection(size as 'Bowl' | 'Plate' | 'Bigger Plate' | 'A La Carte')}
              disabled={!!selectedSize && selectedSize !== size}
            >
              {size}
            </button>
          ))}
        </div>
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
          {!loading && !error && items.map((item) => {
            const sidesCount = currentOrder.filter(i => i.type === 'side').length;
            const entreesCount = currentOrder.filter(i => i.type === 'entree').length;
            const isDisabled = !selectedSize || 
                              !item.available || 
                              (item.type === 'side' && sidesCount >= sizeLimits[selectedSize].sides) || 
                              (item.type === 'entree' && entreesCount >= sizeLimits[selectedSize].entrees);
            return (
              <button
                key={item.food_id}
                className={`p-10 rounded text-sm sm:text-base md:text-lg ${
                  isDisabled
                    ? 'bg-gray-300 bg-opacity-70 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={() => handleAddToOrder(item)}
                disabled={isDisabled}
              >
                {item.food_name}
                {item.premium && ' (+ $2 Premium)'}
                {item.type === 'appetizer' && ' (+ $2 Extra)'}
                {item.type === 'drink' && ' (+ $2 Extra)'}
                {!item.available && <span className="block text-red-500 text-s mt-1">Out of Stock</span>}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center space-x-6 mt-auto">
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
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white"
            aria-label="Back to main menu"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}