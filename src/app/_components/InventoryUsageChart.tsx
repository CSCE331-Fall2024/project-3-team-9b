import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


interface InventoryUsageChartProps {
  usageData: { food_name: string; total_ingredients_used: number }[];
}

const InventoryUsageChart: React.FC<InventoryUsageChartProps> = ({ usageData }) => {

  const labels = usageData.map((item) => item.food_name);
  const usageQuantities = usageData.map((item) => item.total_ingredients_used);

  const data = {
    labels,
    datasets: [
      {
        label: "Ingredients Used",
        data: usageQuantities,
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
        text: "Inventory Usage by Food Item",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default InventoryUsageChart;
