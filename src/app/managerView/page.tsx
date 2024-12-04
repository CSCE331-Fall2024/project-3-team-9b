"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// Define interfaces for the data structures
interface XReportEntry {
  hour_of_day: string;
  employee_name: string;
  employee_orders: number;
  total_sales_for_hour: number;
}

interface ZReportEntry {
  employee_name: string;
  employee_orders: number;
  total_sales: number;
  total_sales_for_day: number;
}

interface InventoryItem {
  ingredient_name: string;
  quantity: number;
}

interface Employee {
  employee_id: number;  
  name: string;
  position: string;
  salary: number;
  email: string;  
}

interface IngredientUsage {
  food_name: string;
  total_ingredients_used: number;
}

interface PeakSalesDay {
  sales_day: string;
  total_order_sum: number;
}

interface SalesHistoryEntry {
  hour_of_day: string;
  total_orders: number;
  total_order_sum: number;
}

interface WeeklySalesHistoryEntry {
  week_number: number;
  total_orders: number;
}

interface ChangeItemPricesEntry {
  price: number;
  size_name: string;
  size_id: number;
}

interface FoodItem {
  food_id: number;
  food_name: string;
  quantity: number;
  type: string;
  calories: number;
  available: boolean;
  premium: boolean;
}

export default function ManagerView() {
  const [activeTab, setActiveTab] = useState("X-Report");

  // State variables for each tab's data
  const [xReport, setXReport] = useState<XReportEntry[]>([]);
  const [zReport, setZReport] = useState<ZReportEntry[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeSalary, setNewEmployeeSalary] = useState("");
  const [newEmployeePosition, setNewEmployeePosition] = useState("");
  const [newEmployeeGender, setNewEmployeeGender] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");

  const [ingredientCount, setIngredientCount] = useState<IngredientUsage[]>([]);
  const [peakSalesDays, setPeakSalesDays] = useState<PeakSalesDay[]>([]);
  const [salesHistory, setSalesHistory] = useState<SalesHistoryEntry[]>([]);
  const [weeklySalesHistory, setWeeklySalesHistory] = useState<WeeklySalesHistoryEntry[]>([]);
  const [changeItemPrices, setChangeItemPrices] = useState<ChangeItemPricesEntry[]>([]);
  const [sizeId, setSizeId] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodQuantity, setNewFoodQuantity] = useState("");
  const [newFoodType, setNewFoodType] = useState("");
  const [newFoodCalories, setNewFoodCalories] = useState("");
  const [newFoodAvailable, setNewFoodAvailable] = useState(true);
  const [newFoodPremium, setNewFoodPremium] = useState(false);
  const [removeFoodId, setRemoveFoodId] = useState("");
  const [error, setError] = useState("");

  const handleAddFood = async () => {
    try {
      if (!newFoodName || !newFoodQuantity || !newFoodType || !newFoodCalories) {
        setError("All fields are required");
        return;
      }
  
      const foodData = {
        food_name: newFoodName,
        quantity: parseInt(newFoodQuantity),
        type: newFoodType,
        calories: parseInt(newFoodCalories),
        available: newFoodAvailable,
        premium: newFoodPremium,
      };
  
      console.log('Sending request to API with:', foodData);
  
      const response = await fetch('/api/fetchMenu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodData),
      });
  
      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error('Error response from API:', errorData);
          throw new Error(errorData.error || 'Failed to add food item');
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error('Unexpected error occurred');
        }
      }
  
      const newFood = await response.json();
      setFoodItems(prev => [...prev, newFood]);
  
      // Reset form
      setNewFoodName("");
      setNewFoodQuantity("");
      setNewFoodType("");
      setNewFoodCalories("");
      setNewFoodAvailable(true);
      setNewFoodPremium(false);
      setError("");
    } catch (error) {
      console.error('Error adding food item:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  

  const handleRemoveFood = async () => {
    try {
      const response = await fetch('/api/fetchMenu', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ food_id: parseInt(removeFoodId) }),
      });

      if (response.ok) {
        setFoodItems(prev => prev.filter(item => item.food_id !== parseInt(removeFoodId)));
        setRemoveFoodId("");
      } else {
        console.error('Failed to remove food item');
      }
    } catch (error) {
      console.error('Error removing food item:', error);
    }
  };

  // Fetch data based on the active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        switch (activeTab) {
          case "X-Report":
            const xReportResponse = await fetch("/api/fetchXReport");
            if (!xReportResponse.ok) {
              throw new Error(`X-Report API Error: ${xReportResponse.status}`);
            }
            const xReportData = await xReportResponse.json();
            setXReport(xReportData.sides || []);
            break;

          case "Z-Report":
            const zReportResponse = await fetch("/api/fetchZReport");
            if (!zReportResponse.ok) {
              throw new Error(`Z-Report API Error: ${zReportResponse.status}`);
            }
            const zReportData = await zReportResponse.json();
            setZReport(zReportData.zReport || []);
            break;

          case "Manage Inventory":
            const inventoryResponse = await fetch("/api/fetchInventory");
            if (!inventoryResponse.ok) {
              throw new Error(`Inventory API Error: ${inventoryResponse.status}`);
            }
            const inventoryData = await inventoryResponse.json();
            setInventory(inventoryData.ingredients || []);
            break;

          case "Manage Employees":
            const employeesResponse = await fetch("/api/fetchEmployees");
            if (!employeesResponse.ok) {
              throw new Error(`Employees API Error: ${employeesResponse.status}`);
            }
            const employeesData = await employeesResponse.json();
            setEmployees(employeesData.employees || []);
            break;

          case "Inventory Usage":
            const ingredientUsageResponse = await fetch("/api/fetchItemIngredientCount");
            if (!ingredientUsageResponse.ok) {
              throw new Error(`Ingredient Usage API Error: ${ingredientUsageResponse.status}`);
            }
            const ingredientUsageData = await ingredientUsageResponse.json();
            setIngredientCount(ingredientUsageData.items || []);
            break;

          case "Peak Sales Day":
            const peakSalesResponse = await fetch("/api/fetchPeakSalesDay");
            if (!peakSalesResponse.ok) {
              throw new Error(`Peak Sales API Error: ${peakSalesResponse.status}`);
            }
            const peakSalesData = await peakSalesResponse.json();
            setPeakSalesDays(peakSalesData.days || []);
            break;

          case "Realistic Sales History":
            const salesHistoryResponse = await fetch("/api/fetchRealisticSalesHistory");
            if (!salesHistoryResponse.ok) {
              throw new Error(`Sales History API Error: ${salesHistoryResponse.status}`);
            }
            const salesHistoryData = await salesHistoryResponse.json();
            setSalesHistory(salesHistoryData.hours || []);
            break;

          case "Weekly Sales History":
            const weeklySalesResponse = await fetch("/api/fetchWeeklySalesHistory");
            if (!weeklySalesResponse.ok) {
              throw new Error(`Weekly Sales API Error: ${weeklySalesResponse.status}`);
            }
            const weeklySalesData = await weeklySalesResponse.json();
            setWeeklySalesHistory(weeklySalesData.weeks || []);
            break;
          case "Change Item Prices":
            const changeItemPricesResponse = await fetch("/api/fetchItemPrices");
            if (!changeItemPricesResponse.ok) {
              throw new Error(`Weekly Sales API Error: ${changeItemPricesResponse.status}`);
            }
            const changeItemsData = await changeItemPricesResponse.json();
            setChangeItemPrices(changeItemsData.sizes || []);
          default:
            break;
          case "Menu":
            const foodItemsResponse = await fetch("/api/fetchMenu");
            if (!foodItemsResponse.ok) {
              throw new Error(`Menu API Error: ${foodItemsResponse.status}`);
            }
            const foodItemsData = await foodItemsResponse.json();
            setFoodItems(foodItemsData.items || []);
            break;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleTabChange = (tab: string) => setActiveTab(tab);

  const handleUpdatePrice = async () => {
    try {
      const response = await fetch('/api/fetchItemPrices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size_id: parseInt(sizeId), new_price: parseFloat(newPrice) }),
      });

      if (response.ok) {
        const updatedSize = await response.json();
        
        setChangeItemPrices(prevPrices =>
          prevPrices.map(size =>
            size.size_id === updatedSize.updatedSize.size_id ? updatedSize.updatedSize : size
          )
        );
        
        setSizeId('');
        setNewPrice('');
      } else {
        console.error('Failed to update price');
      }
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };
  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/fetchEmployees");
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    console.log("Attempting to add employee", { 
        name: newEmployeeName,
        gender: newEmployeeGender,
        salary: newEmployeeSalary,
        position: newEmployeePosition,
        email: newEmployeeEmail,
    });

    try {
        const requestBody = { 
            name: newEmployeeName,
            gender: newEmployeeGender,
            salary: parseFloat(newEmployeeSalary), 
            position: newEmployeePosition,
            email: newEmployeeEmail,
        };

        console.log("Request body:", requestBody); 

        const response = await fetch('/api/fetchEmployees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log("Fetch response received", response); 

        if (response.ok) {
            const responseBody = await response.json();
            console.log("Response body:", responseBody); 
            setEmployees(prev => [...prev, responseBody]); 
            setNewEmployeeName("");
            setNewEmployeeGender("");
            setNewEmployeeSalary("");
            setNewEmployeePosition("");
            setNewEmployeeEmail("");
        } else {
            const errorText = await response.text();
            console.error('Failed to add employee:', errorText);
            throw new Error(errorText);
        }
    } catch (error) {
        console.error('Error adding employee:', error);
    }
};

  

  

  return (
    <div
      className="min-h-screen bg-rose-400 text-white p-6"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b-2 border-rose-500 pb-2 mb-6">
      {[ 
        "X-Report", 
        "Z-Report", 
        "Manage Inventory", 
        "Manage Employees", 
        "Inventory Usage", 
        "Peak Sales Day", 
        "Realistic Sales History", 
        "Weekly Sales History",
        "Change Item Prices",
        "Menu"
      ].map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === tab ? "bg-white text-rose-400" : "bg-rose-500 hover:bg-rose-600"
          }`}
          onClick={() => handleTabChange(tab)}
        >
          {tab}
        </button>
      ))}
      <Link 
        href="/cashierView" 
        className="px-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white">
        Switch to Cashier
      </Link>
      </div>

      {/* Content Panel */}
      <div className="bg-white text-rose-700 rounded-lg shadow-lg p-4">
        {activeTab === "X-Report" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">X-Report</h3>
            <ul>
              {xReport.map((entry, index) => (
                <li key={index}>
                  {entry.hour_of_day}: {entry.employee_name} -{" "}
                  {entry.employee_orders} orders, $
                  {entry.total_sales_for_hour}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "Z-Report" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Z-Report</h3>
            {zReport.length > 0 ? (
              <ul>
                {zReport.map((entry, index) => (
                  <li key={index} className="mb-2">
                    <strong>Employee:</strong> {entry.employee_name} <br />
                    <strong>Orders Taken:</strong> {entry.employee_orders} <br />
                    <strong>Total Sales:</strong> ${entry.total_sales.toFixed(2)} <br />
                    <strong>Total Sales for the Day:</strong> ${entry.total_sales_for_day.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No data available for Z-Report.</p>
            )}
          </div>
        )}
        {activeTab === "Manage Inventory" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Inventory</h3>
            <ul>
              {inventory.map((item, index) => (
                <li key={index}>
                  {item.ingredient_name}: {item.quantity} units
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "Manage Employees" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Employees</h3>
            <ul>
              {employees.map((employee, index) => (
                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <span>
                    {employee.name} - {employee.position}: ${employee.salary}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Add Employee</h4>
              <input
                type="text"
                placeholder="Name"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Salary"
                value={newEmployeeSalary}
                onChange={(e) => setNewEmployeeSalary(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Position"
                value={newEmployeePosition}
                onChange={(e) => setNewEmployeePosition(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Gender"
                value={newEmployeeGender}
                onChange={(e) => setNewEmployeeGender(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmployeeEmail}
                onChange={(e) => setNewEmployeeEmail(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <button
                onClick={handleAddEmployee}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Employee
              </button>
            </div>
          </div>
        )}
        {activeTab === "Peak Sales Day" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Peak Sales Day</h3>
            <ul>
              {peakSalesDays.map((day, index) => (
                <li key={index}>
                  {day.sales_day}: ${day.total_order_sum}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "Realistic Sales History" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Realistic Sales History</h3>
            <ul>
              {salesHistory.map((hour, index) => (
                <li key={index}>
                  {hour.hour_of_day}: {hour.total_orders} orders, $
                  {hour.total_order_sum}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "Weekly Sales History" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Weekly Sales History</h3>
            <ul>
              {weeklySalesHistory.map((week, index) => (
                <li key={index}>
                  Week {week.week_number}: {week.total_orders} orders
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "Change Item Prices" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Item Prices</h3>
            <ul>
              {changeItemPrices.map((size, index) => (
                <li key={index}>
                  ID: {size.size_id} | {size.size_name}: ${size.price}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Update Price</h4>
              <input
                type="number"
                placeholder="Size ID"
                value={sizeId}
                onChange={(e) => setSizeId(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <input
                type="number"
                step="0.01"
                placeholder="New Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <button
                onClick={handleUpdatePrice}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update Price
              </button>
            </div>
          </div>
        )}
        {activeTab === "Switch to Cashier" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Weekly Sales History</h3>
            <ul>
              {weeklySalesHistory.map((week, index) => (
                <li key={index}>
                  Week {week.week_number}: {week.total_orders} orders
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "Menu" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Menu Items</h3>
            <ul>
              {foodItems.map((item) => (
                <li key={item.food_id} className="mb-2">
                  ID: {item.food_id} | {item.food_name} - Quantity: {item.quantity}, Type: {item.type}, 
                  Calories: {item.calories}, Available: {item.available ? 'Yes' : 'No'}, 
                  Premium: {item.premium ? 'Yes' : 'No'}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Add New Food Item</h4>
              {error && <div className="text-red-500 mt-2 mb-2">{error}</div>}
              <input
                type="text"
                placeholder="Food Name"
                value={newFoodName}
                onChange={(e) => setNewFoodName(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newFoodQuantity}
                onChange={(e) => setNewFoodQuantity(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Type"
                value={newFoodType}
                onChange={(e) => setNewFoodType(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Calories"
                value={newFoodCalories}
                onChange={(e) => setNewFoodCalories(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <label className="mr-2">
                Available:
                <input
                  type="checkbox"
                  checked={newFoodAvailable}
                  onChange={(e) => setNewFoodAvailable(e.target.checked)}
                  className="ml-1"
                />
              </label>
              <label className="mr-2">
                Premium:
                <input
                  type="checkbox"
                  checked={newFoodPremium}
                  onChange={(e) => setNewFoodPremium(e.target.checked)}
                  className="ml-1"
                />
              </label>
              <button
                onClick={handleAddFood}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Food Item
              </button>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Remove Food Item</h4>
              <input
                type="number"
                placeholder="Food ID"
                value={removeFoodId}
                onChange={(e) => setRemoveFoodId(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <button
                onClick={handleRemoveFood}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove Food Item
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex mt-6">
      <Link 
        href="/" 
        className="px-6 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-800 text-white"
      >
        Back
      </Link>
    </div>
    </div>
  );
}
