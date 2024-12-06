import React from 'react';
import './Dashboard.css';
import { Link } from "react-router-dom";

function Dashboard() { 
  return (<>
    <div className="container">
      <div className="left">
        <div className="left-top-box">
          <img src="logo1.png" alt="logo" width={220} height={80} />
        </div>
        <div className="left-mid-box">
          <img src="profile_icon.png" alt="Profile icon" width={80} height={80} />
          <div className="mid-text">
            <p>
              Firm Name
              <br />
              GST Number
            </p>
          </div>
        </div>
        <div className="nav-panel">
          <p style={{ backgroundColor: "#E0E0F7" }}>
          <Link to="/" style={{color: "black",  textDecoration: 'none'}}>Dashboard</Link>
          </p>
          <p>
          <Link to="/invoice" style={{color: "white", textDecoration: 'none'}}>Invoice</Link>
          </p>
          <p>
          <Link to="/inventory" style={{color: "white", textDecoration: 'none'}}>Inventory</Link>
          </p>
          <p>
          <Link to="/pendingTransactions" style={{color: "white", textDecoration: 'none'}}>Pending Transactions</Link>
          </p>
          <p>
          <Link to="/contactUs" style={{color: "white", textDecoration: 'none'}}>Contact Us</Link>
          </p>
        </div>
      </div>
    </div>
    <div
      className="top-panel"
      style={{ display: "flex", justifyContent: "left", alignItems: "end" }}
    >
      <span
        style={{
          paddingInlineStart: "0.2cm",
          color: "white",
          fontSize: "1cm",
          fontFamily: '"Times New Roman"'
        }}
      >
        {" "}
        Dashboard
      </span>
    </div>
    <div
      className="main-container"
      style={{ display: "flex", justifyContent: "space-around", paddingTop: 20 }}
    >
      <div className="data-box">
        <p
          style={{
            fontSize: "x-large",
            fontFamily: '"Times New Roman", Times, serif'
          }}
        >
          Today's Sales
          <br />₹ 1,08,324
        </p>
      </div>
      <div className="data-box">
        <p
          style={{
            fontSize: "x-large",
            fontFamily: '"Times New Roman", Times, serif'
          }}
        >
          Today's Profit
          <br />₹ 15,240
        </p>
      </div>
      <div className="data-box">
        <p
          style={{
            fontSize: "x-large",
            fontFamily: '"Times New Roman", Times, serif'
          }}
        >
          Today's Bills
          <br />
          40
        </p>
      </div>
      <div className="data-box">
        <p
          style={{
            fontSize: "x-large",
            fontFamily: '"Times New Roman", Times, serif'
          }}
        >
          Yesterday's Sales
          <br />₹ 1,18,729
        </p>
      </div>
    </div>
  </>
  )
    }
export default Dashboard;
