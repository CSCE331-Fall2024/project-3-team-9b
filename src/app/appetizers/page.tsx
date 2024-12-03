'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import ShoppingCart from '@components/shoppingCart';
import Image from 'next/image';
import { useShoppingDataContext } from '@components/shoppingData';
import WeatherWidget from '@components/WeatherWidget'; 
import ChatBot from '@components/ChatBot'; 

type Food = {
  food_id: number;
  food_name: string;
  quantity: number;
  type: string;
  calories: number;
  available: boolean;
  premium: boolean;
};

export default function Appetizers() {
  const [appetizers, setAppetizers] = useState<Food[]>([]);
  const [selectedAppetizer, setSelectedAppetizer] = useState<number | null>(null);
  // const [currPrice, setCurrPrice] = useState<number>(0);
  const [shoppingData, setShoppingData] = useShoppingDataContext();

  function removeSpace(str: string): string {
    return str.replace(/\s/g, '');
  }

//   useEffect(() => {
//     const cPrice = typeof window !== 'undefined' ? Number(sessionStorage.getItem("currentPrice")) : 0;
//     if (cPrice) {
//       setCurrPrice(Number(cPrice));
//     }
// },[]);



  useEffect(() => {
    fetch('/api/fetchAppetizers')
    .then((res) => res.json())
    .then((data) => {setAppetizers(data.appetizers)})
    
}, []);



  const handleAppetizerSelect = (foodId: number) => {
    setSelectedAppetizer(prevSelected => prevSelected === foodId ? null : foodId);
  };

  // const handleAddToCart = () => {
  //   if (typeof window !== 'undefined') {
  //     const selectedAppItem = appetizers.find(app => app.food_id === selectedAppetizer);
  //     if (selectedAppItem) {
  //       localStorage.setItem('currentPrice', String(currPrice + 2))
  //       setCurrPrice(Number(localStorage.getItem("currentPrice")));
  //       localStorage.setItem('newItem', JSON.stringify(selectedAppItem.food_name) + '/p');
  //     }
  //     setSelectedAppetizer(null);
  //   }
  // };

    const handleAddToCart = () => {
    if (typeof window !== 'undefined') {
      const selectedAppItem = appetizers.find(app => app.food_id === selectedAppetizer);
      if (selectedAppItem) {
        // sessionStorage.setItem('currentPrice', String(currPrice + 2))
        // setCurrPrice(Number(sessionStorage.getItem("currentPrice")));
        // sessionStorage.setItem('newItem', JSON.stringify(selectedAppItem.food_name) + '/p');
        setShoppingData({...shoppingData, currentPrice: shoppingData.currentPrice + 2, cartItems: [...shoppingData.cartItems, selectedAppItem.food_name + "/a"]})
      }
      setSelectedAppetizer(null);
    }
  };

  return (
    <>
    <ShoppingCart/>
    <div className="flex flex-col min-h-screen h-fit items-center rounded-full bg-red-800">
    {/* Static Navigation Section */}
        <Link href="/menuBoardView" 
              className="px-6 py-3 w-fit mt-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              aria-label="View Menu">
          View Menu
        </Link>

      {/* Scrollable Content Section
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
          )} */}
        <div>
        <div className='flex flex-col items-center gap-y-5 mb-40 h-full'>
        <h1 className="text-3xl font-bold text-gray-800 mt-10">Appetizers</h1>
        <div className='flex flex-row gap-4 items-center justify-center mx-10 flex-wrap mb-40'>
        {appetizers.map((item) => (
            <div key={item.food_id} className="">
              <div 
                  className={`bg-white rounded-lg shadow-lg p-6 flex flex-col h-[400px] w-[400px]
                              ${!item.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'} 
                              ${selectedAppetizer === item.food_id ? 'ring-8 ring-green-600' : ''}
                              transition-all duration-200 ease-in-out`}
                  role="button"
                  tabIndex={0}
                  onClick={() => item.available && handleAppetizerSelect(item.food_id)}
                  onKeyPress={(e) => e.key === 'Enter' && item.available && handleAppetizerSelect(item.food_id)}
                  aria-pressed={selectedAppetizer === item.food_id}
                  aria-disabled={!item.available}
                  aria-labelledby={`entree-${item.food_id}`}
                >
                <Image 
                  className="w-full h-full object-cover max-h-[200px]"
                  src={"/" + removeSpace(item.food_name) + ".png"}
                  alt={item.food_name}
                  width = {200} 
                  height = {200}
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
                <div className="text-sm text-gray-600 text-center">
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
          <div>
          {selectedAppetizer !== null && (
          <div className="absolute text-center -translate-x-1/2">
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
      </div>


      {/* Navigation Buttons */}
      <Link
          href="/entrees"
          className="fixed bottom-10 left-10 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Back to sides"
        >
          Back
        </Link>
        <Link
          href="/drinks"
          className="fixed bottom-10 right-10 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Go to appetizers"
        >
          Next
        </Link>
    </div>
    <WeatherWidget/>
    <ChatBot/>
    </>
  );
}
