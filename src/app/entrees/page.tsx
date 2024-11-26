'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import ShoppingCart from '@components/shoppingCart';

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
  entrees: Food[];
  error?: string;
};

export default function Entrees() {
  const [entrees, setEntrees] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntree, setSelectedEntree] = useState<number | null>(null);
  const [debug, setDebug] = useState<string>('');
  const [currPrice, setCurrPrice] = useState<number>(0);

  useEffect(() => {
    const cPrice = Number(localStorage.getItem("currentPrice"));
    if (cPrice) {
      setCurrPrice(Number(cPrice));
    }
},[]);

// useEffect(() => {
//   const cPrice = Number(localStorage.getItem("currentPrice"));
//   if (cPrice) {
//     setCurrPrice(Number(cPrice));
//   }
// },[currPrice]);
  


  function removeSpace(str: string): string {
    return str.replace(/\s/g, '');
  }

  useEffect(() => {
    const fetchEntrees = async () => {
      try {
        const response = await fetch('/api/fetchEntrees');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        const processedEntrees = (data.entrees || []).map(entree => ({
          ...entree,
          available: entree.quantity > 0
        }));

        const sortedEntrees = processedEntrees.sort((a, b) => a.food_id - b.food_id);
        setEntrees(sortedEntrees);
        setDebug(`Fetched ${sortedEntrees.length} entrees, sorted by food_id`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching entrees');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntrees();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setEntrees([]);
    setSelectedEntree(null);
  };

  const handleEntreeSelect = (foodId: number) => {
    setSelectedEntree((prevSelected) => (prevSelected === foodId ? null : foodId));
    console.log(selectedEntree);

    setDebug(`Selected entree with ID: ${foodId}`);
  };

  const handleAddToCart = () => {
    if (typeof window !== 'undefined' && selectedEntree) {
      const selectedEntreeItem = entrees.find(entree => entree.food_id === selectedEntree);
      if (selectedEntreeItem?.premium){
        localStorage.setItem('currentPrice', String(currPrice + 2))
        setCurrPrice(Number(localStorage.getItem("currentPrice")));
      }
      if (selectedEntreeItem) {
        localStorage.setItem('newItem', JSON.stringify(selectedEntreeItem.food_name));
      }
      setSelectedEntree(null);
    }
  };




  return (
    <>
    <ShoppingCart/>
    <div className="flex flex-col min-h-screen h-fit items-center rounded-full bg-red-800">
    {/* Static Navigation Section */}
        <Link href="/menuBoardView" 
              className="px-6 py-3 mt-4 w-fit bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              aria-label="View Menu">
          View Menu
        </Link>
      <div>
      <div className='flex flex-col items-center gap-y-5 mb-40 h-full'>
          <h1 className="text-3xl font-bold text-gray-800 mt-10">Entrees</h1>
          <div className='flex flex-row gap-4 items-center justify-center mx-10 flex-wrap mb-40'>
            {entrees.map((item) => (
              <div key={item.food_id} className="">
                <div 
                  className={`bg-white rounded-lg shadow-lg p-6 flex flex-col h-[400px] w-[400px]
                              ${!item.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'} 
                              ${selectedEntree === item.food_id ? 'ring-8 ring-green-600' : ''}
                              transition-all duration-200 ease-in-out`}
                  role="button"
                  tabIndex={0}
                  onClick={() => item.available && handleEntreeSelect(item.food_id)}
                  onKeyPress={(e) => e.key === 'Enter' && item.available && handleEntreeSelect(item.food_id)}
                  aria-pressed={selectedEntree === item.food_id}
                  aria-disabled={!item.available}
                  aria-labelledby={`entree-${item.food_id}`}
                >
                  <img src={"/" + removeSpace(item.food_name) + ".png"} alt={item.food_name} className="w-full h-full object-cover" />
                  <div className="flex-grow flex flex-col items-center justify-center text-center mb-4">
                    <h3 id={`entree-${item.food_id}`} className="text-2xl font-bold text-gray-800">
                      {item.food_name}
                    </h3>
                    {item.premium && (
                      <span className= "mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full"
                            role="badge">
                        Premium
                      </span>
                      
                    )
                  }

                  </div>

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
              {selectedEntree !== null && (
                <div className="text-center absolute -translate-x-1/2">
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    aria-label="Add selected entree to cart"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
              </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {/* <div className="fixed bottom-0 left-0 right-0 flex justify-between p-4"> */}
        <Link
          href="/sides"
          className="fixed bottom-10 left-10 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Back to sides"
        >
          Back
        </Link>
        <Link
          href="/appetizers"
          className="fixed bottom-10 right-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Go to appetizers"
        >
          Next
        </Link>
      {/* </div> */}
    </div>
    </>
  );
}
