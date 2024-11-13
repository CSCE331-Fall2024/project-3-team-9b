import { useState } from "react";

export default function ShoppingCart(){
    const [currentItems, setCurrentItems] = useState<string[]>(["rice", "cheese", "beans", "pizza"]);

    const addItem = (item: string) =>{
        setCurrentItems([...currentItems, item]);
    }; 
    
    function removeAllItems(){
        setCurrentItems([]);
    }

    const [cart, showCart] = useState(false);
    const toggleCart = () => {
        showCart(!cart);
    };

    const removeItem = (index: number) =>{
        setCurrentItems(currentItems.slice(0, index));
    }
    
    function listCartItems(){
        return currentItems.map((item, index) => {
            return <div key = {index} className="flex justify-center items-center gap-x-4">
                <button className="bg-red-500 rounded-lg w-11 h-10 text-white font-bold text-lg shadow-lg" onClick={() => removeItem(index)}>x</button>
                <div className="bg-white shadow-lg hover:bg-gray-100 rounded-lg w-28 text-lg text-center text-gray-800 font-bold">{item}</div>
                </div>
        })
    }
    
    return (
        <>
            <button className="absolute right-2 top-2 z-10" onClick={toggleCart}><img src = "/ShoppingCart.png"></img></button>
            <div className={`${cart ? "" : "hidden"} fixed bg-gray-700 h-full w-96 right-0 bg-opacity-60 flex rounded-lg flex-col items-center justify-center`}>
                <div className="bg-red-400 rounded-lg h-4/5 w-3/4 flex flex-col items-center justify-start">
                    <div className="text-gray-800 font-bold text-2xl">Your Items:</div>
                    <div className="text-black flex flex-col h-full gap-y-6 w-2/3">{listCartItems()}</div>
                </div>
            </div>
        </>
    )
}