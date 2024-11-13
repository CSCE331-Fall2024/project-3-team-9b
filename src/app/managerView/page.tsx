"use client";
import { useState, useEffect } from 'react';

export default function ManagerView() {
  const [activeTab, setActiveTab] = useState('X-Report');
  const [employees, setEmployees] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [ingredientCount, setIngredientCount] = useState([]);
  const [peakSalesDays, setPeakSalesDays] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [weeklySalesHistory, setWeeklySalesHistory] = useState([]);
  const [xReport, setXReport] = useState([]);
  const [zReport, setZReport] = useState([]);
  
  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      switch (activeTab) {
        case 'X-Report':
          const xReportResponse = await fetch('/api/fetchXReport');
          const xReportData = await xReportResponse.json();
          setXReport(xReportData.sides);
          break;
        case 'Z-Report':
          const zReportResponse = await fetch('/api/fetchZReport');
          const zReportData = await zReportResponse.json();
          setZReport(zReportData.sides);
          break;
        case 'Manage Inventory':
          const inventoryResponse = await fetch('/api/fetchInventory');
          const inventoryData = await inventoryResponse.json();
          setInventory(inventoryData.ingredients);
          break;
        case 'Manage Employees':
          const employeesResponse = await fetch('/api/fetchEmployees');
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData.employees);
          break;
        case 'Inventory Usage':
          const ingredientCountResponse = await fetch('/api/fetchItemIngredientCount');
          const ingredientCountData = await ingredientCountResponse.json();
          setIngredientCount(ingredientCountData.items);
          break;
        case 'Peak Sales Day':
          const peakSalesResponse = await fetch('/api/fetchPeakSalesDay');
          const peakSalesData = await peakSalesResponse.json();
          setPeakSalesDays(peakSalesData.days);
          break;
        case 'Realistic Sales History':
          const salesHistoryResponse = await fetch('/api/fetchRealisticSalesHistory');
          const salesHistoryData = await salesHistoryResponse.json();
          setSalesHistory(salesHistoryData.hours);
          break;
        case 'Weekly Sales History':
          const weeklySalesResponse = await fetch('/api/fetchWeeklySalesHistory');
          const weeklySalesData = await weeklySalesResponse.json();
          setWeeklySalesHistory(weeklySalesData.weeks);
          break;
        default:
          break;
      }
    };
    
    fetchData();
  }, [activeTab]);

  const handleTabChange = (tab: string) => setActiveTab(tab);

  return (
    <div className="flex screen w-full">

      {/* Header Panel: Main Tabs */}
      <div className="flex w-full space-x-4 mb-2 border-b pb-2">
        {['X-Report', 'Z-Report', 'Manage Inventory', 'Manage Employees', 'Inventory Usage', 'Peak Sales Day', 'Realistic Sales History', 'Weekly Sales History'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Panel */}
      <div className="w-full p-4">
        {activeTab === 'X-Report' && (
          <div>
            <h3>X-Report</h3>
            <ul>
              {xReport.map((entry, index) => (
                <li key={index}>
                  {entry.hour_of_day}: {entry.employee_name} - {entry.employee_orders} orders, ${entry.total_sales_for_hour}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'Z-Report' && (
          <div>
            <h3>Z-Report</h3>
            <ul>
              {zReport.map((entry, index) => (
                <li key={index}>
                  {entry.hour_of_day}: ${entry.total_sales_for_hour}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'Manage Inventory' && (
          <div>
            <h3>Inventory</h3>
            <ul>
              {inventory.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} - {ingredient.quantity} units
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'Manage Employees' && (
          <div>
            <h3>Employees</h3>
            <ul>
              {employees.map((employee, index) => (
                <li key={index}>
                  {employee.name} - {employee.position}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'Inventory Usage' && (
          <div>
            <h3>Inventory Usage</h3>
            <ul>
              {ingredientCount.map((item, index) => (
                <li key={index}>
                  {item.Food_Name}: {item.total_ingredients_used} ingredients used
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'Peak Sales Day' && (
          <div>
            <h3>Peak Sales Day</h3>
            <ul>
              {peakSalesDays.map((day, index) => (
                <li key={index}>
                  {day.sales_day}: ${day.total_order_sum}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'Realistic Sales History' && (
          <div>
            <h3>Realistic Sales History</h3>
            <ul>
              {salesHistory.map((hour, index) => (
                <li key={index}>
                  {hour.hour_of_day}: {hour.total_orders} orders, ${hour.total_order_sum}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'Weekly Sales History' && (
          <div>
            <h3>Weekly Sales History</h3>
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
