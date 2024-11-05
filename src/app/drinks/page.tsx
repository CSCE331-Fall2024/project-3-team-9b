'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";

type Drink = {
  food_id: number; // Unique identifier
  drink_name: string;
  quantity: number;
  type: string;
  food_name?: string;
  calories: number;
  available: boolean;
  premium: boolean;
  image_url: string;
};

type ApiResponse = {
  drinks: Drink[];
  error?: string;
};

export default function Drinks() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<number | null>(null);
  const [debug, setDebug] = useState<string>('');

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await fetch('/api/fetchDrinks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();

        const sortedDrinks = (data.drinks || []).map((drink) => ({
          ...drink,
          drink_name: drink.drink_name || drink.food_name || "Unnamed Drink",
        })).sort((a, b) => a.food_id - b.food_id);

        setDrinks(sortedDrinks);
        setDebug(`Fetched ${sortedDrinks.length} drinks, sorted by food_id`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching drinks');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setDrinks([]);
    setSelectedDrink(null);
  };

  const handleDrinkSelect = (foodId: number) => {
    setSelectedDrink(prevSelected => prevSelected === foodId ? null : foodId);
    setDebug(`Selected drink with ID: ${foodId}`);
  };

  const handleAddToCart = () => {
    if (selectedDrink !== null) {
      console.log(`Added drink with ID ${selectedDrink} to cart`);
      setDebug(`Added drink with ID ${selectedDrink} to cart`);
      setSelectedDrink(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 flex justify-center py-4 bg-gray-100 z-10">
        <Link href="/menuBoardView" 
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              aria-label="View Menu">
          View Menu
        </Link>
      </div>

      <div className="flex-grow overflow-auto pt-20 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Drinks</h1>
        
          <div className="mb-4 p-2 bg-gray-200 text-sm">
            Debug: {debug}
          </div>

          {loading && (
            <div className="text-center py-8" role="status" aria-label="Loading">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <span className="sr-only">Loading...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8" role="alert">
              <div className="text-red-600 mb-4">Error loading drinks: {error}</div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                aria-label="Retry loading drinks"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && drinks.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No drinks available at the moment.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {drinks.map((item) => (
              <div key={item.food_id} className="h-64">
                <div 
                    className={`bg-white rounded-lg shadow-lg p-6 flex flex-col h-full
                                ${!item.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'} 
                                ${selectedDrink === item.food_id ? 'ring-4 ring-red-600' : ''}
                                transition-all duration-200 ease-in-out`}
                    role="button"
                    tabIndex={0}
                    onClick={() => item.available && handleDrinkSelect(item.food_id)}
                    onKeyPress={(e) => e.key === 'Enter' && item.available && handleDrinkSelect(item.food_id)}
                    aria-pressed={selectedDrink === item.food_id}
                    aria-disabled={!item.available}
                    aria-labelledby={`drink-${item.food_id}`}
                  >
                  <img 
                    src={item.image_url} 
                    alt={item.drink_name} 
                    className="w-full h-32 object-cover mb-4 rounded-lg"
                  />
                  <div className="flex-grow flex flex-col items-center justify-center text-center mb-4">
                    <h3 id={`drink-${item.food_id}`} className="text-2xl font-bold text-gray-800">
                      {item.drink_name || 'Unnamed Drink'}
                    </h3>
                    {item.premium && (
                      <span className="mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full" role="badge">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="mb-1">Calories: {item.calories}</p>
                    <p className={item.available ? 'text-green-600' : 'text-red-600'} role="status">
                      {item.available ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedDrink !== null && (
            <div className="mt-6 text-center">
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                aria-label="Add selected drink to cart"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 left-6 right-6 flex justify-between">
        <Link
          href="/sides"
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Back to drinks"
        >
          Back
        </Link>
        <Link
          href="/drinks"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Go to checkout"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
