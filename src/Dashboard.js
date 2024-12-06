import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { performSignout } from "./auth";
import Navbar from "./Navbar";
import AuthContext from "./AuthContext";
import axios from "axios";
import LineChart1 from "./components/Charts/LineChart1.js";
function Dashboard() {
  // const navigate = useNavigate();

  // const handleSignout = () => {
  //   performSignout(navigate);
  // };
  const authContext = useContext(AuthContext);
  const [updatePage, setUpdatePage] = useState(true);
  const [todayProfit, setTodayProfit] = useState("");
  const [todaySales, setTodaySales] = useState("");
  const [todayBills, setTodayBills] = useState("");
  const [yesterdaySales, setYesterdaySales] = useState("");
  const [chartData, setChartData] = useState({});
  const [chartData1, setChartData1] = useState({}); // Initialize with an empty object
  const userId = authContext.user;
  const [flag, setFlag] = useState(0);
  const today = new Date();
  //today.setDate(today.getDate() + 1);

  // Calculate the date 7 days ago
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Format dates to 'YYYY-MM-DD' format
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Set startDate and endDate to formatted date strings
  const [startDate, setStartDate] = useState(formatDate(sevenDaysAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const fetchSalesData = () => {
    if (startDate && endDate) {
      axios
        .get(
          `https://billback.orbe.in/api/invoice/sales/${userId}?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response) => {
          const salesData = response.data; // Assuming response.data contains sales data
          // console.log(salesData);
          // console.log(startDate);
          // console.log(endDate);
          setFlag(1);
          //const allDates = generateDateArray(today, sevenDaysAgo);
          const salesByDay = calculateSalesByDay(salesData, startDate, endDate); // Calculate sales by day
          const preparedChartData = prepareChartData(salesByDay); // Prepare chart data
          // console.log(salesByDay)
          setChartData(preparedChartData); // Set chart data
          const profitsByDay = calculateProfitsByDay(
            salesData,
            startDate,
            endDate
          ); // Calculate sales by day
          const preparedChartData1 = prepareChartData1(profitsByDay); // Prepare chart data
          // console.log(profitsByDay);
          setChartData1(preparedChartData1); // Set chart data
        })
        .catch((error) => {
          console.error("Error fetching sales data:", error);
        });
    }
  };

  // Function to generate an array of dates from startDate to endDate
  // const generateDateArray = (startDate, endDate) => {
  //   const dateArray = [];
  //   let currentDate = new Date(startDate);
  //   while (currentDate <= endDate) {
  //     dateArray.push(new Date(currentDate));
  //     currentDate.setDate(currentDate.getDate() + 1);
  //   }
  //   return dateArray;
  // };

  // Function to calculate sales by day
  // Function to calculate sales by day
  const calculateSalesByDay = (salesData, startDate, endDate) => {
    const salesByDay = {};
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const currentDateISO = currentDate.toISOString().split("T")[0];
      salesByDay[currentDateISO] = 0; // Initialize sales for each day to 0
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    salesData.forEach((invoice) => {
      const createdAt = new Date(invoice.createdAt);
      const date = createdAt.toISOString().split("T")[0];
      salesByDay[date] += invoice.totalSales;
    });

    return salesByDay;
  };

  // Function to calculate profits by day
  const calculateProfitsByDay = (salesData, startDate, endDate) => {
    const profitsByDay = {};
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const currentDateISO = currentDate.toISOString().split("T")[0];
      profitsByDay[currentDateISO] = 0; // Initialize profits for each day to 0
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    salesData.forEach((invoice) => {
      const createdAt = new Date(invoice.createdAt);
      const date = createdAt.toISOString().split("T")[0];
      profitsByDay[date] += invoice.totalSales - invoice.totalCostPrice;
    });

    return profitsByDay;
  };

  // Function to prepare chart data
  const prepareChartData = (salesByDay) => {
    const labels = Object.keys(salesByDay);
    const data = Object.values(salesByDay);
    return {
      labels: labels,
      datasets: [
        {
          label: "Total Sales",
          data: data,
        },
      ],
    };
  };
  const prepareChartData1 = (profitsByDay) => {
    const labels = Object.keys(profitsByDay);
    const data = Object.values(profitsByDay);
    return {
      labels: labels,
      datasets: [
        {
          label: "Total Profit",
          data: data,
        },
      ],
    };
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };
  useEffect(() => {
    fetchSalesData();
    fetchDashboardData();
  }, [updatePage]);
  const fetchDashboardData = () => {
    fetch(
      `https://billback.orbe.in/api/invoice/getDashboardData/${authContext.user}`
    )
      .then((response) => response.json())
      .then((data) => {
        setTodayProfit(data.totalSellingPrice - data.totalCostPrice);
        setTodaySales(data.totalSellingPrice);
        setTodayBills(data.numberOfInvoices);
        setYesterdaySales(data.totalSellingPriceYesterday);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  };
  const auth = useContext(AuthContext);
  if (!auth.user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="Dashboard">
      <Navbar />
      <div
        className="main-container"
        style={{
          display: "flex",
          justifyContent: "space-around",
          paddingTop: 120,
        }}
      >
        <div className="data-box">
          <p
            style={{
              fontSize: "x-large",
              fontFamily: '"Times New Roman", Times, serif',
            }}
          >
            Today's Sales
            <br />₹ {todaySales}
          </p>
        </div>
        <div className="data-box">
          <p
            style={{
              fontSize: "x-large",
              fontFamily: '"Times New Roman", Times, serif',
            }}
          >
            Today's Profit
            <br />₹ {todayProfit}
          </p>
        </div>
        <div className="data-box">
          <p
            style={{
              fontSize: "x-large",
              fontFamily: '"Times New Roman", Times, serif',
            }}
          >
            Today's Bills
            <br />
            {todayBills}
          </p>
        </div>
        <div className="data-box">
          <p
            style={{
              fontSize: "x-large",
              fontFamily: '"Times New Roman", Times, serif',
            }}
          >
            Yesterday's Sales
            <br />₹ {yesterdaySales}
          </p>
        </div>
      </div>
      <div style={{ marginTop: "6%" }}>
        {/* <div>
      <button
            onClick={fetchSalesData}
            style={{
              width: "200px",
              height: "50px",
              padding: "10px",
              marginLeft: "50%",
                 marginRight: "10px",
              backgroundColor: "#B3E5FC",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "20px", // Increased font size
    fontWeight: "bold", 
    color: "#283593",
              transition: "background-color 0.3s",
              font: "15px",
              marginTop:"40px",
              marginBottom: "50px",
            }}
          >
            See Graphs{" "}
          </button>
          </div> */}
        {flag === 1 && ( // Conditionally render LineChart1 when flag is 1
          <div
            style={{
              width: "40%",
              display: "inline-block",
              marginLeft: "250px",
            }}
          >
            <h2>Total Sales this week</h2>
            <LineChart1 Data={chartData} yAxisTitle="Total Sales" />
          </div>
        )}
        {flag === 1 && ( // Conditionally render LineChart1 when flag is 1
          <div style={{ width: "40%", display: "inline-block" }}>
            <h2>Total Profit this week</h2>
            <LineChart1 Data={chartData1} yAxisTitle="Total Profit" />
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
