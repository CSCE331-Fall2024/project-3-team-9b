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


export default function Sides() {
  const [sides, setSides] = useState<Food[]>([]);
  const [selectedSide, setSelectedSide] = useState<number | null>(null);
  const [shoppingCart, setShoppingCart] = useShoppingDataContext();

  function removeSpace(str: string): string {
    return str.replace(/\s/g, '');
  }

    useEffect(() => {
      fetch('/api/fetchSides')
      .then((res) => res.json())
      .then((data) => {console.log(data.sides);setSides(data.sides)})
      
  }, []);


  const handleSideSelect = (foodId: number) => {
    setSelectedSide((prevSelected) => (prevSelected === foodId ? null : foodId));

  };

  const handleAddToCart = () => {
    if (typeof window !== 'undefined') {
      let selectedSideItem = sides.find(side => side.food_id === selectedSide);
      if (selectedSide === 101){
        selectedSideItem = sides.find(side => side.food_id === 0);
      }
      if (selectedSideItem && shoppingCart.size === 3){
        setShoppingCart({...shoppingCart, cartItems: [...shoppingCart.cartItems, selectedSideItem.food_name + "/l/s"], currentPrice: shoppingCart.currentPrice + 4});
      }
      else if (selectedSideItem) {
        // sessionStorage.setItem('newItem', JSON.stringify(selectedSideItem.food_name));
        setShoppingCart({...shoppingCart, cartItems: [...shoppingCart.cartItems, selectedSideItem.food_name]});
      }
      setSelectedSide(null);
    }
  };

  return (
    <>
      <ShoppingCart/>
      <div className="flex flex-col min-h-screen h-fit items-center rounded-full bg-red-800">
        {/* Static Navigation Section */}
        {/* <div className="fixed top-0 left-0 right-0 flex justify-center py-4 z-10"> */}
          <Link href="/menuBoardView" 
                className="px-6 py-3 mt-4 w-fit bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                aria-label="View Menu">
            View Menu
          </Link>

        {/* Scrollable Content Section
        <div className="flex-grow overflow-auto pt-20 px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Sides</h1>
          
            

            {loading && (
              <div className="text-center py-8" role="status" aria-label="Loading">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <span className="sr-only">Loading...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-8" role="alert">
                <div className="text-red-600 mb-4">Error loading sides: {error}</div>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  aria-label="Retry loading sides"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && sides.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                No sides available at the moment.
              </div>
            )} */}
          <div>
            <div className='flex flex-col items-center mb-40 h-full gap-y-5'>
              <h1 className="text-3xl font-bold text-white-800 mt-10">Sides</h1>
              <div className='flex flex-row gap-4 items-center justify-center mx-10 flex-wrap mb-40'>
              {sides.map((item) => (
                <div key={item.food_id} className="h-100">
                  <div 
                    className={`bg-white rounded-lg shadow-lg p-6 flex flex-col h-[400px] w-[400px]
                                ${!item.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'} 
                                ${selectedSide === item.food_id ? 'ring-8 ring-green-600' : ''}
                                transition-all duration-200 ease-in-out`}
                    role="button"
                    tabIndex={0}
                    onClick={() => item.available && handleSideSelect(item.food_id)}
                    onKeyPress={(e) => e.key === 'Enter' && item.available && handleSideSelect(item.food_id)}
                    aria-pressed={selectedSide === item.food_id}
                    aria-disabled={!item.available}
                    aria-labelledby={`side-${item.food_id}`}
                  >
                    {/* Top section with image */}  
                    <Image className="object-cover w-full h-full" src= {"/" + removeSpace(item.food_name) + ".png"} width = {200} height = {200} alt={item.food_name} />
                    {/* Center section with name */}
                    <div className="flex-grow flex flex-col items-center justify-center text-center mb-4">
                      <h3 id={`side-${item.food_id}`} className="text-2xl font-bold text-gray-800">
                        {item.food_name}
                      </h3>
                      {item.premium && (
                        <span className="mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full"
                              role="badge">
                          Premium
                        </span>
                      )}
                    </div>
                    {/* Bottom section with details */}
                    <div className="text-sm text-gray-600 text-center">
                      <p className="mb-1">Calories: {item.calories}</p>
                      <p className={`${item.available ? 'text-green-600' : 'text-red-600'} font-semibold`}
                        role="status">
                        {item.available ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              {selectedSide !== null && (
                <div className="text-center absolute -translate-x-1/2">
                  <Link href = "/entrees"><button
                    onClick={handleAddToCart}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    aria-label="Add selected entree to cart"
                  >
                    Add to Cart
                  </button>
                  </Link>
                </div>
              )}
              </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex justify-center space-x-4">
    
          <Link
            href="/entrees"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Go to appetizers"
          >
          Next
        </Link>
      </div>
    </div>
    <WeatherWidget/>
    <ChatBot/>
    </>
  );
}
