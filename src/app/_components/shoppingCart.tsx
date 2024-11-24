import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";

export default function ShoppingCart() {
    const [currentItems, setCurrentItems] = useState<string[]>([]);
    const [currPrice, setCurrentPrice] = useState<String>("");
    const addItems = (item: string) => {
        setCurrentItems([...currentItems, item]);
    };

    function removeAllItems(): void {
        setCurrentItems([]);
        console.log("clicked!");
    }

    const [cart, showCart] = useState(false);
    const [conformation, showConformation] = useState(false);

    const toggleCart = () => {
        showCart(!cart);
    };

    const removeItem = (index: number) => {
        // if(currentItems[index] === "BlackPepperSirloinSteak")
        setCurrentItems([
            ...currentItems.slice(0, index),
            ...currentItems.slice(index + 1)
        ]);
        localStorage.setItem("cartItems", currentItems.join(","));
    };

    const checkout = async () => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentItems)
            });
            console.log(response);
        } catch (error) {
            console.error('Error fetching entrees:', error);
        }
        setCurrentItems([]);
        localStorage.removeItem("cartItems");
        console.log("Checkout successful!");
    }


    useEffect(
        () => {
            const currCart = localStorage.getItem("cartItems");
            if (currCart) {
                setCurrentItems(currCart.split(","));
                localStorage.removeItem("cartItems");
            }            
        },[]
    )

    // useEffect
    // ...
    useEffect(() => {
        const newItem = localStorage.getItem("newItem");
        if (newItem !== null) {
            addItems(newItem.replaceAll("\"", ""));
            localStorage.removeItem("newItem");
        }
        localStorage.setItem("cartItems",currentItems.toString());
    });

    useEffect(() => {
        const cPrice = localStorage.getItem("currentPrice");
        if (cPrice) {
            setCurrentPrice(cPrice);
            // localStorage.removeItem("currentPrice");
        }
    },[]);

    useEffect(() => {
        setCurrentPrice(localStorage.getItem("currentPrice"));
    },[localStorage.getItem("currentPrice")]);



    
    function listCartItems() {
        return currentItems.map((item, index) => (
            <div key={index} className="flex justify-center items-center gap-x-4">
                <button className="bg-red-500 rounded-lg w-11 h-10 text-white font-bold text-lg shadow-lg" onClick={() => removeItem(index)}>x</button>
                <div className="bg-white shadow-lg hover:bg-gray-100 rounded-lg w-28 text-lg text-center text-gray-800 font-bold">{item}</div>
            </div>
        ));

    }

    return (
        <>
            <button className="absolute right-2 top-2 z-10 w-20 h-20" onClick={toggleCart}><img src="/ShoppingCart.png" alt="Shopping Cart" /></button>
            <div className={`${cart ? "" : "hidden"} fixed bg-gray-700 h-full w-96 right-0 bg-opacity-60 flex rounded-lg flex-col items-center justify-center`}>
                <div className="relative bg-red-400 rounded-lg h-[75%] w-3/4 flex flex-col items-center justify-start">
                    <div className="text-gray-800 font-bold text-2xl">Your Items:</div>
                    <div className="text-black flex flex-col h-full gap-y-6 w-2/3">{listCartItems()}</div>
                    <div className="absolute w-full h-10 bottom-0 rounded-lg bg-white flex flex-row justify-around items-center">
                        <div className="text-gray-800">Price:</div>
                        <div className="text-gray-800">${String(currPrice)}</div>
                    </div>
                </div>
                <Link href="/customerView"><button className="p-5 bg-white mt-4 text-gray-800 rounded-lg" onClick={() => removeAllItems()}>Reset Order</button></Link>
                <button className="p-5 bg-green-500 mt-4 text-gray-800 rounded-lg" onClick = {() => showConformation(true)}>Checkout</button>

            </div>
            <div className= {`${conformation ? "" : "hidden"} absolute left-1/2 top-1/2 -translate-y-2/4 -translate-x-1/2 h-1/5 w-1/2 rounded-lg bg-gray-200 flex flex-col items-center gap-y-10 `}>
                <div className="text-gray-800 text-3xl mt-10">Do you wish to checkout?</div>
                <div className="flex justify-around w-full text-gray-800">
                    <button className="bg-red-700 p-10 rounded-xl" onClick={() => showConformation(false)}>No</button>
                    <Link href={"/"} className="bg-green-500 p-10 rounded-xl" onClick={() => {checkout(); showConformation(false); }}>Yes</Link>
                </div>
            </div>
        </>
    );
}
