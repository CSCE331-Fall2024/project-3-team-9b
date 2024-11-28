"use client";
import { useState, useEffect } from "react";

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
  name: string;
  quantity: number;
}

interface Employee {
  name: string;
  position: string;
}

interface IngredientUsage {
  Food_Name: string;
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

  // Fetch data based on the active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        switch (activeTab) {
          case "X-Report":
            const xReportResponse = await fetch("/_api/fetchXReport");
            if (!xReportResponse.ok) {
              throw new Error(`X-Report API Error: ${xReportResponse.status}`);
            }
            const xReportData = await xReportResponse.json();
            setXReport(xReportData.sides || []);
            break;

          case "Z-Report":
            const zReportResponse = await fetch("/_api/fetchZReport");
            if (!zReportResponse.ok) {
              throw new Error(`Z-Report API Error: ${zReportResponse.status}`);
            }
            const zReportData = await zReportResponse.json();
            setZReport(zReportData.zReport || []);
            break;

          case "Manage Inventory":
            const inventoryResponse = await fetch("/_api/fetchInventory");
            if (!inventoryResponse.ok) {
              throw new Error(`Inventory API Error: ${inventoryResponse.status}`);
            }
            const inventoryData = await inventoryResponse.json();
            setInventory(inventoryData.ingredients || []);
            break;

          case "Manage Employees":
            const employeesResponse = await fetch("/_api/fetchEmployees");
            if (!employeesResponse.ok) {
              throw new Error(`Employees API Error: ${employeesResponse.status}`);
            }
            const employeesData = await employeesResponse.json();
            setEmployees(employeesData.employees || []);
            break;

          case "Inventory Usage":
            const ingredientUsageResponse = await fetch("/_api/fetchItemIngredientCount");
            if (!ingredientUsageResponse.ok) {
              throw new Error(`Ingredient Usage API Error: ${ingredientUsageResponse.status}`);
            }
            const ingredientUsageData = await ingredientUsageResponse.json();
            setIngredientCount(ingredientUsageData.items || []);
            break;

          case "Peak Sales Day":
            const peakSalesResponse = await fetch("/_api/fetchPeakSalesDay");
            if (!peakSalesResponse.ok) {
              throw new Error(`Peak Sales API Error: ${peakSalesResponse.status}`);
            }
            const peakSalesData = await peakSalesResponse.json();
            setPeakSalesDays(peakSalesData.days || []);
            break;

          case "Realistic Sales History":
            const salesHistoryResponse = await fetch("/_api/fetchRealisticSalesHistory");
            if (!salesHistoryResponse.ok) {
              throw new Error(`Sales History API Error: ${salesHistoryResponse.status}`);
            }
            const salesHistoryData = await salesHistoryResponse.json();
            setSalesHistory(salesHistoryData.hours || []);
            break;

          case "Weekly Sales History":
            const weeklySalesResponse = await fetch("/_api/fetchWeeklySalesHistory");
            if (!weeklySalesResponse.ok) {
              throw new Error(`Weekly Sales API Error: ${weeklySalesResponse.status}`);
            }
            const weeklySalesData = await weeklySalesResponse.json();
            setWeeklySalesHistory(weeklySalesData.weeks || []);
            break;

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
        ].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab
                ? "bg-white text-rose-400"
                : "bg-rose-500 hover:bg-rose-600"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
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
                  {item.name}: {item.quantity} units
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
                  {employee.name} - {employee.position}
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
                  {item.Food_Name}: {item.total_ingredients_used} ingredients used
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
      </div>
    </div>
  );
}
