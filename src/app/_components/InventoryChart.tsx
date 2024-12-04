import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface InventoryChartProps {
  inventoryData: { ingredient_name: string; quantity: number }[];
}

const InventoryChart: React.FC<InventoryChartProps> = ({ inventoryData }) => {

  const labels = inventoryData.map((item) => item.ingredient_name);
  const quantities = inventoryData.map((item) => item.quantity);

  const data = {
    labels,
    datasets: [
      {
        label: "Inventory Levels",
        data: quantities,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Inventory Levels by Ingredient",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default InventoryChart;
