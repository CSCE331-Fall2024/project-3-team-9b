import Link from "next/link";
import {useState } from "react";
import Image from "next/image";
import { useShoppingDataContext } from "./shoppingData";

export default function ShoppingCart() {
    // const [currentItems, setCurrentItems] = useState<string[]>([]);
    


    // const [currPrice, setCurrentPrice] = useState<string | null>("");
    // const [numEntrees, setNumEntrees] = useState<number | null>(0);
    // const [currentItems, setCurrentItems] = useContext(shoppingDataContext);
    // const [currPrice, setCurrentPrice] = useContext(shoppingDataContext);
    // const [numEntrees, setNumEntrees] = useContext(shoppingDataContext);
    // const shoppingData = useShoppingDataContext();
    // const [shoppingData, changeShoppingData] = useContext(shoppingDataContext);
    const [shoppingData, setShoppingData] = useShoppingDataContext();


    console.log(shoppingData);

    function removeAllItems(): void {
        // setCurrentItems([]);
        setShoppingData({size: -1, currentPrice: 0, numEntrees: 0, cartItems: []});
    }

    const [cart, showCart] = useState(false);
    const [conformation, showConformation] = useState(false);
    const [weatherDiscount, setWeatherDiscount] = useState(false);

    const toggleCart = () => {
        showCart(!cart);
    };

    const removeItem = (index: number) => {
        // setCurrentItems([
        //     ...currentItems.slice(0, index),
        //     ...currentItems.slice(index + 1)
        // ]);
        // if (currentItems[index].includes("/p")){
        //     sessionStorage.setItem("currentPrice", (Number(currPrice) - 1.5).toString());
        // }
        if (shoppingData.cartItems[index].includes("/p") && shoppingData.cartItems[index].includes("/l") && shoppingData.cartItems[index].includes("/e")){
            setShoppingData({...shoppingData,  currentPrice: shoppingData.currentPrice - 6.5, cartItems: [...shoppingData.cartItems.slice(0, index), ...shoppingData.cartItems.slice(index + 1)]})

            // shoppingData.currentPrice = (Number(shoppingData.currentPrice) - 1.5).toString();
        }
        else if (shoppingData.cartItems[index].includes("/l") && shoppingData.cartItems[index].includes("/e")){
            setShoppingData({...shoppingData,  currentPrice: shoppingData.currentPrice - 5, cartItems: [...shoppingData.cartItems.slice(0, index), ...shoppingData.cartItems.slice(index + 1)]})

            // shoppingData.currentPrice = (Number(shoppingData.currentPrice) - 1.5).toString();
        }
        else if (shoppingData.cartItems[index].includes("/p") && shoppingData.cartItems[index].includes("/e")){
            setShoppingData({...shoppingData, numEntrees: shoppingData.numEntrees + 1, currentPrice: shoppingData.currentPrice - 1.5, cartItems: [...shoppingData.cartItems.slice(0, index), ...shoppingData.cartItems.slice(index + 1)]})

            // shoppingData.currentPrice = (Number(shoppingData.currentPrice) - 1.5).toString();
        }
        else if(shoppingData.cartItems[index].includes("/l") && shoppingData.cartItems[index].includes("/s")){
            setShoppingData({...shoppingData, currentPrice: shoppingData.currentPrice - 4, cartItems: [...shoppingData.cartItems.slice(0, index), ...shoppingData.cartItems.slice(index + 1)]})
        }

        else if(shoppingData.cartItems[index].includes("/p")){
            setShoppingData({...shoppingData, currentPrice: shoppingData.currentPrice - 1.5, cartItems: [...shoppingData.cartItems.slice(0, index), ...shoppingData.cartItems.slice(index + 1)]})

        }
        else if(shoppingData.cartItems[index].includes("/e")){
            setShoppingData({...shoppingData,cartItems: [...shoppingData.cartItems.slice(0, index), ...shoppingData.cartItems.slice(index + 1)], numEntrees: shoppingData.numEntrees + 1});

        }
        else if(shoppingData.cartItems[index].includes("/a")){
            setShoppingData({...shoppingData, currentPrice: shoppingData.currentPrice - 2, cartItems: [...shoppingData.cartItems.slice(0, index), ...shoppingData.cartItems.slice(index + 1)]})
        }
        else if(shoppingData.cartItems[index].includes("/d")){
            setShoppingData({...shoppingData, currentPrice: shoppingData.currentPrice - 2, cartItems: [...shoppingData.cartItems.slice(0, index), ...shoppingData.cartItems.slice(index + 1)]})
        }
        else{
            setShoppingData({...shoppingData, cartItems: [...shoppingData.cartItems.slice(0, index), ...shoppingData.cartItems.slice(index + 1)]})

        }

        // sessionStorage.setItem("cartItems", currentItems.join(","));
        // sessionStorage.setItem("numEntrees", (Number(numEntrees) + 1).toString());
    };


    // useEffect(() => {
    //     setNumEntrees(Number(localStorage.getItem("numEntrees")));
    // },[]);
    
    // useEffect(() => {
    //     if (typeof window !== 'undefined') setNumEntrees(Number(sessionStorage.getItem("numEntrees")));
    // });


    
    const checkout = async () => {
        // apply discount before sending to db
        if (weatherDiscount) {
            shoppingData.currentPrice = Number((shoppingData.currentPrice * 0.85).toFixed(2));
        }

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    employee: 15,
                    cart: shoppingData.cartItems,
                    totalPrice: shoppingData.currentPrice,
                    size: shoppingData.size
                })
            });
            // if (response.ok) {
            //     const data = await response.json();
            //     console.log(data.message); // 'Checkout successful'
            // }
            console.log(response);
        } catch (error) {
            console.error('Error during checkout:', error);
        }
        setShoppingData({size: -1, currentPrice: 0, numEntrees: 0, cartItems: []});
        console.log("Checkout successful!");
    }

    // useEffect(
    //     () => {
    //         const currCart = sessionStorage.getItem("cartItems");
    //         if (currCart) {
    //             setCurrentItems(currCart.split(","));
    //             sessionStorage.removeItem("cartItems");
    //         }            
    //     },[]
    // )

    // useEffect
    // ...
    // useEffect(() => {
    //     const newItem = sessionStorage.getItem("newItem");
    //     if (newItem !== null) {
    //         addItems(newItem.replaceAll("\"", ""));
    //         sessionStorage.removeItem("newItem");
    //     }
    //     sessionStorage.setItem("cartItems",currentItems.toString());
    // });

    // useEffect(() => {
    //     const cPrice = sessionStorage.getItem("currentPrice");
    //     if (cPrice) {
    //         setCurrentPrice(cPrice);
    //         // localStorage.removeItem("currentPrice");
    //     }
    // },[]);

    // useEffect(() => {
    //     setCurrentPrice(sessionStorage.getItem("currentPrice"));
    // },[sessionStorage.getItem("currentPrice")]);



    
    function listCartItems() {

        // check if temperature is under 60F, if it is give a 15% discount
        const temperature = Number(sessionStorage.getItem('temperature'));
        if (temperature < 60 && !weatherDiscount) {
            setWeatherDiscount(true);
        }

        // return currentItems.map((item: string, index: number) => (
            return (shoppingData.cartItems).map((item: string, index: number) => (

            <div key={index} className="flex justify-center items-center gap-x-4">
                <button className="bg-red-500 rounded-lg w-11 h-10 text-white font-bold text-lg shadow-lg" onClick={() => removeItem(index)}>x</button>
                <div className="bg-white shadow-lg p-5 hover:bg-gray-100 rounded-lg w-28 text-lg text-center text-gray-800 font-bold">{item.replace("/p", "").replace("/e", "").replace("/a", "").replace("/d", "").replace("/s", "").replace("/l", "")}</div>
            </div>
        ));

    }

    return (
        <>
            <button className="absolute left-2 top-2 z-10 w-20 h-20" onClick={toggleCart}><Image src="/ShoppingCart.png" alt="Shopping Cart" width={200} height={200} /></button>
            <div className={`${cart ? "" : "hidden"} fixed bg-gray-700 h-full w-96 left-0 bg-opacity-60 flex rounded-lg flex-col items-center justify-center`}>
                <div className="relative bg-red-400 rounded-lg h-[75%] w-3/4 flex flex-col items-center justify-start">
                    <div className="text-gray-800 font-bold text-2xl">Your Items:</div>
                    <div className="text-black flex flex-col h-full gap-y-6 w-2/3">{listCartItems()}</div>
                    <div className="absolute w-full h-10 bottom-0 rounded-lg bg-white flex flex-row justify-around items-center">
                    <div className="text-gray-800">Price:</div>
                    <div className="flex items-center">
                        <div className="text-gray-800">
                        ${weatherDiscount ? (shoppingData.currentPrice * 0.85).toFixed(2) : shoppingData.currentPrice.toFixed(2)}
                        </div>
                        {weatherDiscount && (
                        <span className="text-green-600 ml-2 text-sm font-bold">15% OFF</span>
                        )}
                    </div>
                    </div>
                </div>
                <Link href="/customerView"><button className="p-5 bg-white mt-4 text-gray-800 rounded-lg" onClick={() => removeAllItems()}>Reset Order</button></Link>
                <button className="p-5 bg-green-500 mt-4 text-gray-800 rounded-lg" onClick = {() => {showConformation(true); toggleCart()}}>Checkout</button>

            </div>
            <div className= {`${conformation ? "" : "hidden"} absolute left-1/2 top-1/4 -translate-y-2/4 -translate-x-1/2 h-fit w-1/2 rounded-lg bg-gray-200 flex flex-col items-center gap-y-10 py-10`}>
                <div className="text-gray-800 text-3xl mt-10">Do you wish to checkout?</div>
                <div className="w-1/2 h-fit bg-white justify-center items-center rounded-xl flex flex-col gap-y-5">
                    <div className="text-gray-800 text-3xl">Current Order:</div>
                    {shoppingData.cartItems.map((item: string, index: number) => {
                        return <div key={index} className="text-gray-800">{item.replace("/p", "").replace("/e", "").replace("/a", "").replace("/d", "").replace("/s", "").replace("/l", "")}</div>
                    })}
                    <div className="flex items-center">
                        <div className="text-gray-800 text-2xl">Total: ${weatherDiscount ? (shoppingData.currentPrice * 0.85).toFixed(2) : shoppingData.currentPrice.toFixed(2)}</div>
                        {weatherDiscount && (
                        <span className="text-green-600 ml-2 text-sm font-bold">15% OFF</span>
                        )}
                    </div>
                </div>
                <div className="flex justify-around w-full text-gray-800">
                    <button className="bg-red-700 p-10 rounded-xl text-white" onClick={() => showConformation(false)}>No</button>
                    <Link href={"/"} className="bg-green-500 p-10 rounded-xl text-white" onClick={() => {checkout(); showConformation(false); }}>Yes</Link>
                </div>
            </div>
        </>
    );
}
