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

type ApiResponse = {
  appetizers: Food[];
  error?: string;
};

export default function Appetizers() {
  const [appetizers, setAppetizers] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppetizer, setSelectedAppetizer] = useState<number | null>(null);
  const [debug, setDebug] = useState<string>('');

  function removeSpace(str: string): string {
    return str.replace(/\s/g, '');
  }

  useEffect(() => {
    const fetchAppetizers = async () => {
      try {
        const response = await fetch('/api/fetchAppetizers');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        // Sort appetizers by food_id in ascending order
        const sortedAppetizers = (data.appetizers || []).sort((a, b) => a.food_id - b.food_id);
        setAppetizers(sortedAppetizers);
        setDebug(`Fetched ${sortedAppetizers.length} appetizers, sorted by food_id`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching appetizers');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppetizers();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setAppetizers([]);
    setSelectedAppetizer(null);
  };

  const handleAppetizerSelect = (foodId: number) => {
    setSelectedAppetizer(prevSelected => prevSelected === foodId ? null : foodId);
    setDebug(`Selected appetizer with ID: ${foodId}`);
  };

  const handleAddToCart = () => {
    if (selectedAppetizer) {
      console.log(`Added appetizer with ID ${selectedAppetizer} to cart`);
      setDebug(`Added appetizer with ID ${selectedAppetizer} to cart`);
      setSelectedAppetizer(null);
      // Here you would typically add the logic to actually add the item to the cart
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Static Navigation Section */}
      <div className="fixed top-0 left-0 right-0 flex justify-center py-4 bg-gray-100 z-10">
        <Link href="/menuBoardView" 
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              aria-label="View Menu">
          View Menu
        </Link>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-grow overflow-auto pt-20 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Appetizers</h1>
      

          {loading && (
            <div className="text-center py-8" role="status" aria-label="Loading">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <span className="sr-only">Loading...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8" role="alert">
              <div className="text-red-600 mb-4">Error loading appetizers: {error}</div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                aria-label="Retry loading entrees"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && appetizers.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No entrees available at the moment.
            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {appetizers.map((item) => (
            <div key={item.food_id} className="h-100">
              <div 
                  className={`bg-white rounded-lg shadow-lg p-6 flex flex-col h-full
                              ${!item.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'} 
                              ${selectedAppetizer === item.food_id ? 'ring-4 ring-red-600' : ''}
                              transition-all duration-200 ease-in-out`}
                  role="button"
                  tabIndex={0}
                  onClick={() => item.available && handleAppetizerSelect(item.food_id)}
                  onKeyPress={(e) => e.key === 'Enter' && item.available && handleAppetizerSelect(item.food_id)}
                  aria-pressed={selectedAppetizer === item.food_id}
                  aria-disabled={!item.available}
                  aria-labelledby={`entree-${item.food_id}`}
                >
                <img 
                  className="w-full h-48 object-cover"
                  src={"/" + removeSpace(item.food_name) + ".png"}
                  alt={item.food_name}
                />
                <div className="flex-grow flex flex-col items-center justify-center text-center mb-4">
                  <h3 id={`appetizer-${item.food_id}`} className="text-2xl font-bold text-gray-800">
                    {item.food_name}
                  </h3>
                  {item.premium && (
                    <span className="mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full"
                          role="badge">
                      Premium
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">Calories: {item.calories}</p>
                  <p className={item.available ? 'text-green-600' : 'text-red-600'}
                     role="status">
                    {item.available ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedAppetizer !== null && (
          <div className="mt-6 text-center">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Add selected appetizer to cart"
            >
              Add to Cart
            </button>
          </div>
        )}
        </div>
      </div>


      {/* Navigation Buttons */}
      <div className="fixed bottom-6 left-6 right-6 flex justify-between">
        <Link
          href="/sides"
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Back to entrees"
        >
          Back
        </Link>
        <Link
          href="/appetizers"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Go to drinks"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
