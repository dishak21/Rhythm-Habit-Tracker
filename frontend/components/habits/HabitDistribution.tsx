import React from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BiBorderRadius } from "react-icons/bi";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HabitBarChart = ({ habitCat }) => {
  // Extract data for the chart
  const labels = Object.keys(habitCat); // Categories
  const data = Object.values(habitCat).map(({ count }) => count); // Counts
  const backgroundColors = Object.values(habitCat).map(({ color }) => color); // Colors

  // Chart.js data configuration
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Number of habits",
        data: data,
        backgroundColor: backgroundColors, // Use dynamic colors
        borderWidth: 1,
        borderRadius: 7,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        enabled: true, // Disable tooltips
        borderRadius: 10,
        padding: 15,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        display: false,
      },
    },
  };

  return (
    <div className="flex">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default HabitBarChart;
