//import React from "react";
//import { Pie } from "react-chartjs-2";
//import { Chart as ChartJS } from "chart.js/auto";

// const PieChart = ({ Data }) => {
//   return (
//     <div>
//       <Pie
//         data={Data}
//         options={{
//           legend: {
//             display: true,
//             position: 'bottom', // You can adjust the position as needed
//             labels: {
//               font: {
//                 size: 14, // Adjust font size as needed
//               },
//             },
//           },
//         }}
//       />
//     </div>
//   );
// };

// export default PieChart;


import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ Data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      // If chart instance exists, destroy it before creating a new one
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: Data,
      options: {
        responsive: false, // Ensure chart doesn't resize
        maintainAspectRatio: false, // Ensure canvas doesn't resize
      },
    });

    return () => {
      // Cleanup function to destroy chart instance when component unmounts
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [Data]);

  return <canvas ref={chartRef} width="400" height="400" />; // Set fixed width and height
};

export default PieChart;