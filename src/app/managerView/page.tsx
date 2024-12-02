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
  name: string;
  position: string;
  salary: number;
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

export default function ManagerView() {
  const [activeTab, setActiveTab] = useState("X-Report");

  // State variables for each tab's data
  const [xReport, setXReport] = useState<XReportEntry[]>([]);
  const [zReport, setZReport] = useState<ZReportEntry[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [ingredientCount, setIngredientCount] = useState<IngredientUsage[]>([]);
  const [peakSalesDays, setPeakSalesDays] = useState<PeakSalesDay[]>([]);
  const [salesHistory, setSalesHistory] = useState<SalesHistoryEntry[]>([]);
  const [weeklySalesHistory, setWeeklySalesHistory] = useState<WeeklySalesHistoryEntry[]>([]);
  const [changeItemPrices, setChangeItemPrices] = useState<ChangeItemPricesEntry[]>([]);
  const [sizeId, setSizeId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  
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
        // Update the state with the new price
        setChangeItemPrices(prevPrices =>
          prevPrices.map(size =>
            size.size_id === updatedSize.updatedSize.size_id ? updatedSize.updatedSize : size
          )
        );
        // Clear the input fields
        setSizeId('');
        setNewPrice('');
      } else {
        console.error('Failed to update price');
      }
    } catch (error) {
      console.error('Error updating price:', error);
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
        "Change Item Prices"
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
                <li key={index}>
                  {employee.name} - {employee.position}: ${employee.salary}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "Inventory Usage" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Inventory Usage</h3>
            <ul>
              {ingredientCount.map((item, index) => (
                <li key={index}>
                  {item.food_name}: {item.total_ingredients_used} ingredients used
                </li>
              ))}
            </ul>
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
