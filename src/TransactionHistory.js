import React, { useState, useEffect, useContext } from "react";
import "./TransactionHistory.css";
import { Link } from "react-router-dom";
import AuthContext from "./AuthContext";
import axios from "axios";
import { initialState } from "./components/Invoice/initialState";
import Navbar from "./Navbar";
import { saveAs } from "file-saver";
import ReactLoading from "react-loading";
import SearchIcon from "@mui/icons-material/Search"; // Import Search icon from Material-UI

const TransactionHistory = () => {
  const [updatePage, setUpdatePage] = useState(true);
  const [transactions, setAllTransactions] = useState([]);
  const [customerName, setCustomerName] = useState();
  const authContext = useContext(AuthContext);
  const [invoiceData, setInvoiceData] = useState(initialState);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    gstno: "",
    shopname: "",
    shopaddress: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.customerName.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  useEffect(() => {
    fetchTransactionData();
    setInvoiceData((prevState) => ({ ...prevState, userID: authContext.user }));
  }, [updatePage]);

  //const userId = "user";
  const userId = authContext.user;

  const fetchTransactionData = () => {
    fetch(`https://billback.orbe.in/api/invoice/get/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setAllTransactions(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchSearchData = () => {
    fetch(
      `https://billback.orbe.in/api/invoice/search/${userId}?customerName=${customerName}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAllTransactions(data);
      })
      .catch((err) => console.log(err));
  };

  const getUserData = () => {
    return new Promise((resolve, reject) => {
      fetch(`https://billback.orbe.in/api/user/get/${authContext.user}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          userData.firstname = data.firstname;
          userData.lastname = data.lastname;
          userData.email = data.email;
          userData.password = data.password;
          userData.gstno = data.gstno;
          userData.shopname = data.shopname;
          userData.shopaddress = data.shopaddress;
          userData.phonenumber = data.phonenumber;
          resolve(data);
        })
        .catch((error) => {
          console.log("There was a problem with the fetch operation:", error);
          reject(error);
        });
      // console.log(userData);
    });
  };

  const createPdf = async () => {
    setShowLoading(true);
    // (() => {
    try {
      const requestData = {
        invoiceData: invoiceData,
        userID: authContext.user,
      };

      const res = await axios.post(
        "https://billback.orbe.in/api/generate-pdf",
        requestData,
        { responseType: "blob" }
      );
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      setShowLoading(false);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      setShowLoading(false); // Hide loading in case of error
      console.error("Error creating PDF:", error);
    }
  };

  const handleCustomerName = async (e) => {
    await setCustomerName(e.target.value);
    fetchSearchData();
  };

  const populateInvoiceData = (element) => {
    invoiceData.userID = authContext.user;
    invoiceData.invoiceID = element.invoiceID;
    invoiceData.customerName = element.customerName;
    invoiceData.phoneNo = element.phoneNo;
    invoiceData.customerEmail = element.customerEmail;
    invoiceData.totalAmount = element.totalAmount;
    invoiceData.notes = element.notes;
    invoiceData.paymentMode = element.paymentMode;
    invoiceData.discount = element.discount;
    invoiceData.itemList = element.itemList;
    invoiceData.createdAt = element.createdAt;
    // setInvoiceData(element);
    // console.log(element);
    // console.log(invoiceData);
    createPdf(); // Remove calling createPdf here
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    const options = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    };
    const formatter = new Intl.DateTimeFormat("en", options);
    return formatter.format(newDate);
  };

  return (
    <>
      {showLoading && ( // Conditionally render loading component
        <div className="loading-overlay">
          <ReactLoading type="spin" color="#000" height={50} width={50} />
        </div>
      )}
      <div className="TransactionHistory">
        <Navbar />
        <div className="main-container">
          <div className="top" style={{ marginTop: "3.5%" }}>
            <div className="search-bar-container">
              <input
                type="text"
                className="search-bar"
                placeholder="Search by customer name"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <SearchIcon className="search-icon" />{" "}
              {/* Use Search icon from Material-UI */}
            </div>
          </div>
          <table id="inventoryTable">
            <thead>
              <tr className="headers">
                <th>DATE</th>
                <th>CUSTOMER NAME</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                <th>INVOICE ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((element, index) => (
                // {transactions && transactions.map((element, index) => {
                //   return (
                <tr
                  key={element._id}
                  style={{
                    marginBottom: "20px",
                    // borderBottom: '4px solid #dddddd'
                  }}
                >
                  <td style={{ padding: "10px" }}>
                    {formatDate(element.createdAt)}
                  </td>
                  <td style={{ padding: "10px" }}>{element.customerName}</td>
                  <td style={{ padding: "10px" }}>{element.paymentMode}</td>
                  <td style={{ padding: "10px" }}>{element.totalAmount}</td>
                  <td>
                    <span
                      className="action-button"
                      onClick={() => populateInvoiceData(element)}
                    >
                      {element.invoiceID + " "}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TransactionHistory;
