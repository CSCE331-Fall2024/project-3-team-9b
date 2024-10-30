"use client";
import { useState } from "react";

export default function CashierView() {
  const [activeTab, setActiveTab] = useState("entrees");
  const [selectedSize, setSelectedSize] = useState<"Bowl" | "Plate" | "Bigger Plate" | null>(null);
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  // Define the allowed number of sides and entrees for each size
  const sizeLimits = {
    Bowl: { sides: 1, entrees: 1 },
    Plate: { sides: 1, entrees: 2 },
    "Bigger Plate": { sides: 1, entrees: 3 },
  };

  const itemPrices: { [key: string]: number } = {
    "Side 1": 0,
    "Side 2": 0,
    "Side 3": 0,
    "Entree 1": 0,
    "Entree 2": 0,
    "Entree 3": 0,
    "Appetizer 1": 0,
    "Appetizer 2": 0,
    "Appetizer 3": 0,
  };

  const handleTabChange = (tab: string) => setActiveTab(tab);

  const handleSizeSelection = (size: "Bowl" | "Plate" | "Bigger Plate") => {
    setSelectedSize(size);
    setCurrentOrder([]); // Clear the current order when changing size
    setTotalCost(0); // Reset the total cost
  };

  const handleAddToOrder = (item: string) => {
    const sidesCount = currentOrder.filter((orderItem) => orderItem.startsWith("Side")).length;
    const entreesCount = currentOrder.filter((orderItem) => orderItem.startsWith("Entree")).length;

    // Check if adding the item exceeds the limit
    if (
      selectedSize &&
      ((item.startsWith("Side") && sidesCount >= sizeLimits[selectedSize].sides) ||
        (item.startsWith("Entree") && entreesCount >= sizeLimits[selectedSize].entrees))
    ) {
      return; // Don't add item if it exceeds the limit
    }

    setCurrentOrder([...currentOrder, item]);
    setTotalCost(totalCost + itemPrices[item]);
  };

  const handleReset = () => {
    setSelectedSize(null);
    setCurrentOrder([]);
    setTotalCost(0);
  };

  const handleComplete = () => {
    // Logic for completing the order (e.g., sending to backend or confirming)
  };

  const handleFinish = () => {
    // Logic for finishing the transaction
  };

  const sidesCount = currentOrder.filter((item) => item.startsWith("Side")).length;
  const entreesCount = currentOrder.filter((item) => item.startsWith("Entree")).length;

  return (
    <div className="flex h-screen">
      {/* Left Panel: Current Order List */}
      <div className="w-1/4 p-4 bg-gray-100 border-r flex flex-col">
        <h2 className="text-lg text-blue-500 text-center font-bold mb-4">Current Transaction</h2>
        <ul className="space-y-2 flex-grow">
          {currentOrder.map((item, index) => (
            <li key={index} className="p-2 bg-white rounded shadow text-gray-800">
              {item} - ${itemPrices[item].toFixed(2)}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-lg font-bold text-blue-600">Total: ${totalCost.toFixed(2)}</div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col p-4">
        {/* Header Panel: Main Tabs */}
        <div className="flex space-x-4 mb-2 border-b pb-2">
          {["sides", "entrees", "appetizers"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-semibold ${
                activeTab === tab ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Sub-Header Panel: Size Selection */}
        <div className="flex space-x-4 mb-4 border-b pb-2">
          {["Bowl", "Plate", "Bigger Plate"].map((size) => (
            <button
              key={size}
              className={`px-4 py-2 font-semibold ${
                selectedSize === size ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
              }`}
              onClick={() => handleSizeSelection(size as "Bowl" | "Plate" | "Bigger Plate")}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Grid Section for Menu Items */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {(activeTab === "sides" ? ["Side 1", "Side 2", "Side 3"] :
            activeTab === "entrees" ? ["Entree 1", "Entree 2", "Entree 3"] :
            ["Appetizer 1", "Appetizer 2", "Appetizer 3"]
          ).map((item) => (
            <button
              key={item}
              className={`p-4 rounded ${
                (!selectedSize || 
                (item.startsWith("Side") && sidesCount >= sizeLimits[selectedSize].sides) ||
                (item.startsWith("Entree") && entreesCount >= sizeLimits[selectedSize].entrees)
                )
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => handleAddToOrder(item)}
              disabled={
                !selectedSize || 
                (item.startsWith("Side") && sidesCount >= sizeLimits[selectedSize].sides) ||
                (item.startsWith("Entree") && entreesCount >= sizeLimits[selectedSize].entrees)
              }
            >
              {item}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-auto">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={handleReset}
          >
            Reset Order
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleComplete}
          >
            Complete Order
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleFinish}
          >
            Finish Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
