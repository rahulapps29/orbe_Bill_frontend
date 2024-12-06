import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import { Link, Navigate } from "react-router-dom";
import BarChart from "./components/Charts/BarChart1.js";
import LineChart1 from "./components/Charts/LineChart1.js";
import PieChart from "./components/Charts/PieChart.js";
import Navbar from "./Navbar";
import axios from "axios";
import AuthContext from "./AuthContext.js";
import "./Reports.css";
const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState({});
  const [chartData1, setChartData1] = useState({});
  const [chartData2, setChartData2] = useState({});
  const [chartData3, setChartData3] = useState({});
  const [topCustomers, setTopCustomers] = useState([]);
  const [flag, setFlag] = useState(0);
  const authContext = useContext(AuthContext);
  const userId = authContext.user;

  useEffect(() => {
    fetchSalesData();
  }, [startDate, endDate]);
  const fetchSalesData = () => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        alert("Start Date must be before the End date");
        return;
      }
      axios
        .get(
          `https://billback.orbe.in/api/invoice/sales/${userId}?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response) => {
          const salesData = response.data; // Assuming response.data contains sales data
          // console.log(salesData);

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
          const invoicesByDay = calculateInvoicesByDay(
            salesData,
            startDate,
            endDate
          ); // Calculate sales by day
          const preparedChartData2 = prepareChartData2(invoicesByDay); // Prepare chart data
          // console.log(invoicesByDay);
          setChartData2(preparedChartData2);
          const paymentModeDistributionData =
            calculatePaymentModeDistribution(salesData);
          // console.log(paymentModeDistributionData);
          const preparedChartData3 = prepareChartData3(
            paymentModeDistributionData
          );
          // console.log(preparedChartData3);
          setChartData3(preparedChartData3);
          const topCustomersData = calculateTopCustomers(salesData);
          // console.log(topCustomersData);
          setTopCustomers(topCustomersData);
          setFlag(1);
        })
        .catch((error) => {
          console.error("Error fetching sales data:", error);
        });
    }
  };

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

  const calculateInvoicesByDay = (salesData, startDate, endDate) => {
    const invoicesByDay = {};
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const currentDateISO = currentDate.toISOString().split("T")[0];
      invoicesByDay[currentDateISO] = 0; // Initialize sales for each day to 0
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    salesData.forEach((invoice) => {
      const createdAt = new Date(invoice.createdAt);
      const date = createdAt.toISOString().split("T")[0];
      invoicesByDay[date] += 1;
    });

    return invoicesByDay;
  };
  const calculatePaymentModeDistribution = (salesData) => {
    let paidSalesData = 0;
    let totalCreditSales = 0;

    salesData.forEach((invoice) => {
      if (invoice.paymentMode === "Paid") {
        paidSalesData += invoice.totalSales;
      } else if (invoice.paymentMode === "Credit") {
        totalCreditSales += invoice.totalSales;
      }
    });

    return {
      paidSalesData,
      totalCreditSales,
    };
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
  const prepareChartData2 = (invoicesByDay) => {
    const labels = Object.keys(invoicesByDay);
    const data = Object.values(invoicesByDay);
    return {
      labels: labels,
      datasets: [
        {
          label: "Total Bills",
          data: data,
        },
      ],
    };
  };

  const prepareChartData3 = (paymentModeData) => {
    // const labels = Object.keys(paymentModeData);
    const labels = ["Paid Sales", "Credit Sales"];
    const data = Object.values(paymentModeData);
    return {
      labels: labels,
      datasets: [
        {
          label: "Payment Mode Distribution",
          data: data,
          backgroundColor: ["#36A2EB", "#FFCE56"],
        },
      ],
    };
  };

  const calculateTopCustomers = (salesData) => {
    // Create a map to store total sales for each customer
    const customerSalesMap = new Map();

    // Calculate total sales for each customer
    salesData.forEach((invoice) => {
      const { customerEmail, totalSales } = invoice;
      const currentTotalSales = customerSalesMap.get(customerEmail) || 0;
      customerSalesMap.set(customerEmail, currentTotalSales + totalSales);
    });

    // Sort customers by total sales
    const sortedCustomers = [...customerSalesMap.entries()].sort(
      (a, b) => b[1] - a[1]
    );

    // Select top 5 customers
    const topCustomers = sortedCustomers.slice(0, 5);

    // Return top customers data
    return topCustomers.map(([email, totalSales]) => {
      // Find customer details from sales data
      const customerDetails = salesData.find(
        (invoice) => invoice.customerEmail === email
      );
      return {
        name: customerDetails.customerName,
        email: email,
        totalSales: totalSales,
      };
    });
  };

  const auth = useContext(AuthContext);
  if (!auth.user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="Reports">
      <Navbar />

      <div className="main-container" style={{ paddingTop: "120px" }}>
        <div style={{ marginBottom: "6%", marginLeft: "50px" }}>
          <label
            style={{
              display: "inline-block",
              margin: "20px",
              marginBottom: "20px",
            }}
          >
            Start Date:{" "}
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              // padding: "10px",
              height: "40px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "none", // Remove default box-shadow
              fontSize: "16px",
              marginBottom: "10px",
              width: "30%",
              flex: "1",
            }}
          />
          {/* </div>
        <div> */}
          <label style={{ display: "inline-block", margin: "20px" }}>
            End Date:{" "}
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              // padding: "10px",
              height: "40px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "none", // Remove default box-shadow
              fontSize: "16px",
              marginBottom: "10px",
              width: "30%",
              flex: "1",
            }}
          />
        </div>
        <div style={{ marginLeft: "80px" }}>
          {flag === 1 && (
            <div
              style={{
                minWidth: "400",
                width: "50%",
                maxWidth: "500px",
                display: "inline-block",
                marginLeft: "1%",
              }}
            >
              <h2>Total Sales/Date</h2>
              <LineChart1 Data={chartData} yAxisTitle="Total Sales" />
            </div>
          )}
          {flag === 1 && (
            <div
              style={{
                minWidth: "400",
                width: "50%",
                maxWidth: "500px",
                display: "inline-block",
                marginLeft: "1%",
              }}
            >
              <h2>Total Profit/Date</h2>
              <LineChart1 Data={chartData1} yAxisTitle="Total Profit" />
            </div>
          )}
        </div>
        <div style={{ marginLeft: "80px" }}>
          {flag === 1 && (
            <div
              style={{
                minWidth: "400",
                width: "50%",
                maxWidth: "500px",
                display: "inline-block",
              }}
            >
              <h2>Total Bills/Date</h2>
              <LineChart1 Data={chartData2} yAxisTitle="Total Bills" />
            </div>
          )}
          {flag === 1 && (
            <div
              style={{
                minWidth: "400",
                width: "50%",
                maxWidth: "400px",
                display: "inline-block",
                marginLeft: "120px",
              }}
            >
              <h2>Sales Distribution</h2>
              <PieChart Data={chartData3} />
            </div>
          )}
          {flag === 1 && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "20px",
                }}
              >
                Top 5 Customers by Sales
              </h2>

              <table id="inventoryTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, index) => (
                    <tr key={index}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.totalSales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Reports;
