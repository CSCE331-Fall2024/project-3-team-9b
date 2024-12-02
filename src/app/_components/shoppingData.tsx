'use client'
import { createContext, Dispatch, SetStateAction, useContext} from "react";

// export const shoppingDataContext = createContext([]);
// export const numEntrees = createContext<number>(0);
// export const currentPrice = createContext<number>(0);
// export const newItem = createContext<string>("");
// export const cartItems = createContext([]);

export interface shoppingDataInterface {
    numEntrees: number;
    currentPrice: number;
    cartItems: string[];
    size: number;
}


export const shoppingDataContext = createContext<[shoppingDataInterface, Dispatch<SetStateAction<shoppingDataInterface>>]>([{numEntrees: 0, currentPrice: 0, cartItems: [], size: -1}, () => {}]);

export function useShoppingDataContext(){
    const data = useContext(shoppingDataContext);
    if (data === undefined) throw new Error("No shopping data");
    return data;
}

// function shoppingDataProvider() {
//     const [numEntrees, setNumEntrees] = useState(0);
//     const [currentPrice, setCurrentPrice] = useState(0);
//     const [newItem, setNewItem] = useState("");
//     const [cartItems, setCartItems] = useState([]);
//     return (
//         <shoppingDataContext.Provider value={[numEntrees, setNumEntrees, currentPrice, setCurrentPrice, newItem, setNewItem, cartItems, setCartItems]}>
//             <ShoppingCart />
//             <Drinks />
//             <Appetizers />
//             <Entrees />
//             <Sides />
//             <CustomerView/>
//         </shoppingDataContext.Provider>
//     )
// }


