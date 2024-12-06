import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineChart1 = ({ Data, yAxisTitle }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: Data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Hide legend
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
              font: {
                size: 14,
                weight: "bold",
              },
            },
      border: {
        display: true,
        color: "black", // Set border color to black
      },
         
            grid: {
              display: true,
              color:"lightblue",
            },
            ticks: {
              color: "black",
              font: {
                weight: "bold",
              },
            },
            borderColor: "black",
            borderWidth: 2,
          },
          y: {
            display: true,
            title: {
              display: true,
              text: yAxisTitle, 
              font: {
                size: 14,
                weight: "bold",
                color: "black",
              },
            },
            ticks: {
              color: "black",
              lineWidth: 2,
              font: {
                weight: "bold",
              },
            },
            border: {
              display: true,
              color:"black",
            },
            grid: {
              display: false,
            },
            beginAtZero: true,
          },
        },
        elements: {
          point: {
            backgroundColor: "black",
          },
          line: {
            borderColor: "black",
            borderWidth: 3,
          },
        },
      },
    });

    return () => {
     
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [Data]);

  return (
    <div>
     
      <canvas ref={chartRef} width="500" height="300" />
    </div>
  );
};

export default LineChart1;
