import { useState } from "react";
const currentItems: string[] = [];
export function addItem(item: string){
    currentItems.push(item);
}; 

export default function ShoppingCart(){
    const [cart, showCart] = useState(false);
    const toggleCart = () => {
        showCart(!cart);
    };
    
    return (
        <>
            <button className="absolute right-2 top-2 z-10" onClick={toggleCart}><img src = "/ShoppingCart.png"></img></button>
            <div className={`${cart ? "" : "hidden"} fixed bg-gray-700 h-full w-96 right-0 bg-opacity-60 flex rounded-lg flex-col items-center justify-center`}>
                <div className="bg-white rounded-lg h-4/5 w-3/4 flex flex-col items-center">
                    <div className="text-gray-800 font-bold text-2xl">Your Items:</div>
                </div>
            </div>
        </>
    )
}