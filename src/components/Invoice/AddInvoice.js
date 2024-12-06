import React, { useEffect, useState, useContext } from "react";
import "./AddInvoice.css";
import axios from "axios";
import { initialState } from "./initialState";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchableDropdown from "./SearchableDropdown";
import ReactLoading from "react-loading";
import AuthContext from "../../AuthContext";

const AddNewInvoice = () => {
  const [invoiceData, setInvoiceData] = useState(initialState);
  const [incInvoiceID, setIncInvoiceID] = useState(false);
  const [totalChange, setTotalChange] = useState(false);
  const [items, setAllItems] = useState([]);
  const [currItem, setCurrItem] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [isPaid, setIsPaid] = useState(true);
  const [availableQuantity, setAvailableQuantity] = useState(1000000000000000);
  const [showLoading, setShowLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    gstno: "",
    shopname: "",
    shopaddress: "",
  });
  const [optionList, setOptionList] = useState([]);

  const handleItemSelection = (selectedItem) => {
    setAvailableQuantity(selectedItem.quantity);
    const filteredOptions = items.filter(
      (item) =>
        !invoiceData.itemList.some(
          (selectedItem) => selectedItem._id === item._id
        )
    );
    setOptionList(filteredOptions);
  };
  useEffect(() => {
    const filteredOptions = items.filter(
      (item) =>
        !invoiceData.itemList.some(
          (selectedItem) => selectedItem._id === item._id
        )
    );
    setOptionList(filteredOptions);
  }, [items, invoiceData]);

  const handleInputChange = async (event, index, fieldName) => {
    const { value } = event.target;
    if (value != null) {
      const updatedItemList = [...invoiceData.itemList];
      if (fieldName === "itemName") {
        updatedItemList[index].itemName = value["itemName"];
        updatedItemList[index].costPrice = value["costPrice"];
        updatedItemList[index].rate = value["salePrice"];
        updatedItemList[index].gst = value["itemGST"];
        updatedItemList[index]._id = value["_id"];
        handleItemSelection(value);
        let quantity =
          isNaN(updatedItemList[index].quantity) ||
          updatedItemList[index].quantity
            ? parseFloat(updatedItemList[index].quantity)
            : 0;
        if (quantity > value["quantity"]) {
          alert("Quantity entered exceeds available stock !");
          updatedItemList[index].quantity = 0;
          quantity = 0;
        }
        const rate = parseFloat(updatedItemList[index].rate.toFixed(2));
        const gst = parseFloat(updatedItemList[index].gst.toFixed(2));
        const amount = quantity * rate + (quantity * rate * gst) / 100;
        updatedItemList[index].amount = parseFloat(amount.toFixed(2));
        // setTotalChange(true);
      }
      if (fieldName === "quantity") {
        let quantity = parseInt(value, 10);
        quantity = quantity === "" ? 0 : quantity;
        if (quantity > availableQuantity) {
          alert("Quantity entered exceeds available stock !");
          updatedItemList[index].quantity = 0;
          quantity = 0;
        }
        quantity = quantity <= 0 ? "" : quantity;
        const rate = parseFloat(updatedItemList[index].rate.toFixed(2));
        const gst = parseFloat(updatedItemList[index].gst.toFixed(2));
        const amount = quantity * rate + (quantity * rate * gst) / 100;
        updatedItemList[index].amount = isNaN(amount)
          ? 0
          : parseFloat(amount.toFixed(2));
        updatedItemList[index].quantity = quantity;
      }
      setInvoiceData({
        ...invoiceData,
        userID: authContext.user,
        itemList: updatedItemList,
        // discount: 0,
      });
    }
    setTotalChange(true);
  };

  const handleInputChangeCust = async (event, fieldName) => {
    const { value } = event.target;
    if (fieldName === "discount") {
      let discount = parseFloat(value);
      discount = discount === "" ? 0 : discount;
      discount = discount <= 0 ? "" : discount;
      discount = discount >= 100 ? 100 : discount;
      setInvoiceData((prevData) => {
        const updatedItemList = [...prevData.itemList];
        const arr = updatedItemList;
        var subTotal = 0;
        for (var i = 0; i < arr.length; i++) {
          subTotal = subTotal + parseFloat(arr[i].amount.toFixed(2));
        }
        var total = 0;
        const temp = parseFloat(
          (subTotal - (subTotal * prevData.discount) / 100).toFixed(2)
        );
        total = temp.toFixed(2);
        total = isNaN(total) ? 0 : parseFloat(total);
        return {
          ...prevData,
          itemList: updatedItemList,
          totalAmount: total,
          discount: discount,
        };
      });
    } else {
      setInvoiceData((prevData) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }

    setTotalChange(true);
  };
  const calculateTotal = () => {
    const arr = invoiceData.itemList;
    var subTotal = 0;
    for (var i = 0; i < arr.length; i++) {
      subTotal = subTotal + parseFloat(arr[i].amount.toFixed(2));
    }
    const temp = parseFloat(
      (subTotal - (subTotal * invoiceData.discount) / 100).toFixed(2)
    );
    invoiceData.totalAmount = isNaN(temp) ? 0 : parseFloat(temp.toFixed(2));
  };
  setInterval(() => {
    calculateTotal();
    const now = new Date();
    const adjustedTime = new Date(now.getTime() + (5 * 60 + 30) * 60000);
    invoiceData.createdAt = new Date(adjustedTime);
  }, 50);

  useEffect(() => {
    const arr = invoiceData.itemList;
    var subTotal = 0;
    for (var i = 0; i < arr.length; i++) {
      subTotal = subTotal + parseFloat(arr[i].amount.toFixed(2));
    }
    let disc = isNaN(invoiceData.discount) ? 0 : invoiceData.discount;
    const temp = parseFloat(subTotal - (subTotal * disc) / 100);
    // console.log(subTotal);
    invoiceData.totalAmount = temp.toFixed(2);
    setTotalChange(false);
  }, [totalChange]);

  const handleAddField = (e) => {
    e.preventDefault();
    setInvoiceData((prevState) => ({
      ...prevState,
      userID: authContext.user,
      itemList: [
        ...prevState.itemList,
        { itemName: "", quantity: 0, costPrice: 0, rate: 0, gst: 0, amount: 0 },
      ],
    }));
  };

  const handleDeleteRow = (index) => {
    // console.log(invoiceData.discount);
    setInvoiceData((prevData) => {
      const updatedItemList = [...prevData.itemList];
      updatedItemList.splice(index, 1);
      const arr = updatedItemList;
      var subTotal = 0;
      for (var i = 0; i < arr.length; i++) {
        subTotal = subTotal + parseFloat(arr[i].amount.toFixed(2));
      }
      var total = 0;
      const temp = parseFloat(
        (subTotal - (subTotal * prevData.discount) / 100).toFixed(2)
      );
      // total = (isNaN(temp)) ? 0 : parseFloat(temp.toFixed(2));
      total = temp.toFixed(2);
      return {
        ...prevData,
        itemList: updatedItemList,
        totalAmount: total,
        // discount: invoiceData.discount
      };
    });
  };

  const handleGenerateBill = async () => {
    try {
      setShowLoading(true);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^\d{10}$/;
      if (!invoiceData.customerName) {
        alert("Please fill Customer Name");
        return;
      } else if (!invoiceData.customerEmail) {
        alert("Please fill Customer Email");
        return;
      } else if (!emailRegex.test(invoiceData.customerEmail)) {
        alert("Please enter a valid email address");
        return;
      } else if (!invoiceData.phoneNo) {
        alert("Please fill phone number");
        return;
      } else if (!phonePattern.test(invoiceData.phoneNo)) {
        alert("Please enter a valid phone number");
        return;
      } else if (invoiceData.itemList.length > 1) {
        // Filter out empty rows from itemList
        invoiceData.itemList = invoiceData.itemList.filter(
          (item) => item.itemName !== ""
        );
        calculateTotal();
      }
      if (invoiceData.itemList.length === 0) {
        alert("Please add some items. Empty invoice cannot be generated.");
        return;
      }
      //setShowLoading(true);

      await addInvoice();
      await updateInventory();
      // await downloadPdf();
    } catch (error) {
      console.error("Error generating bill:", error);
    } finally {
      setShowLoading(false);
      // window.location.reload();
    }
  };

  const addInvoice = () => {
    if (
      !invoiceData.customerEmail ||
      !invoiceData.customerName ||
      !invoiceData.itemList
    ) {
      alert("Please enter all the details.");
      return; // Stop further execution
    }
    const requestData = {
      invoiceData: invoiceData,
      userID: authContext.user,
    };
    fetch("https://billback.orbe.in/api/invoice/sendmail", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    fetch("https://billback.orbe.in/api/invoice/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    })
      .then(() => {
        alert("Invoice ADDED");
        setInvoiceData(initialState);
        setCurrItem(null);
      })
      .then(() => {
        setIncInvoiceID(true);
        // window.location.reload();
      })
      .catch((err) => console.log(err));

    setUpdatePage(false);
  };

  const generatePdf = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    if (!invoiceData.customerName) {
      alert("Please fill Customer Name");
      return;
    } else if (!invoiceData.customerEmail) {
      alert("Please fill Customer Email");
      return;
    } else if (!emailRegex.test(invoiceData.customerEmail)) {
      alert("Please enter a valid email address");
      return;
    } else if (!invoiceData.phoneNo) {
      alert("Please fill phone number");
      return;
    } else if (!phonePattern.test(invoiceData.phoneNo)) {
      alert("Please enter a valid phone number");
      return;
    } else if (invoiceData.itemList.length > 1) {
      // Filter out empty rows from itemList
      invoiceData.itemList = invoiceData.itemList.filter(
        (item) => item.itemName !== ""
      );
      calculateTotal();
    }
    if (invoiceData.itemList.length === 0) {
      alert("Please add some items. Empty invoice cannot be generated.");
      return;
    }
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

  const updateInventory = () => {
    fetch("https://billback.orbe.in/api/inventory/updateItemQuantity", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(invoiceData.itemList),
    }).then(() => {
      setUpdatePage(false);
      window.location.reload(); // Reload the webpage
    });
  };

  const getInvoiceCount = async () => {
    fetch(`https://billback.orbe.in/api/invoice/count/${authContext.user}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data.count);
        setInvoiceData({ ...invoiceData, invoiceID: data.count });
      })
      .catch((error) => {
        console.log("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    // if(incInvoiceID){
    getInvoiceCount(invoiceData.userID).then(() => setIncInvoiceID(false));
    // }
  }, [incInvoiceID, invoiceData.userID]);

  useEffect(() => {
    fetchItemsData();
    // fetchSalesData();
    setInvoiceData(initialState);
  }, [updatePage]);
  // const userId='user';

  const fetchItemsData = () => {
    fetch(`https://billback.orbe.in/api/inventory/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllItems(data);
      })
      .catch((err) => console.log(err));
  };

  const togglePaymentMode = () => {
    setInvoiceData((prevData) => ({
      ...prevData,
      paymentMode: isPaid ? "Credit" : "Paid",
    }));
    setIsPaid((prevState) => !prevState);
  };

  return (
    <>
      {showLoading && (
        <div className="loading-overlay">
          <ReactLoading type="spin" color="#000" height={50} width={50} />
        </div>
      )}
      <div className="customer-details">
        <table id="customerTable">
          <tbody>
            <tr>
              <td className="input-box">
                <input
                  type="text"
                  required
                  autocomplete="one-time-code"
                  value={invoiceData.customerName}
                  onChange={(e) => handleInputChangeCust(e, "customerName")}
                  placeholder="Customer Name"
                />
              </td>
              <td className="input-box">InvoiceID : {invoiceData.invoiceID}</td>
            </tr>
            <tr>
              <td className="input-box">
                <input
                  type="text"
                  required
                  autocomplete="one-time-code"
                  value={invoiceData.customerEmail}
                  onChange={(e) => handleInputChangeCust(e, "customerEmail")}
                  placeholder="Customer Email"
                />
              </td>
              <td className="input-box">
                <input
                  type="text"
                  autocomplete="one-time-code"
                  value={invoiceData.phoneNo}
                  onChange={(e) => handleInputChangeCust(e, "phoneNo")}
                  placeholder="Customer Phone No"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="main-container">
        <div className="itemListContainer">
          <table id="invoiceTable">
            <thead>
              <tr class="headers">
                <th>Item Details</th>
                <th>Quantity</th>
                <th>Price (per unit)</th>
                <th>GST (%)</th>
                <th>Amount (&#8377;)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.itemList.map((item, index) => (
                <tr key={index}>
                  <td placeholder="Select Item">
                    <SearchableDropdown
                      options={optionList}
                      label="itemName"
                      id={index}
                      selectedVal={currItem}
                      handleChange={(selectedItem) => {
                        handleInputChange(
                          { target: { value: selectedItem } },
                          index,
                          "itemName"
                        );
                      }}
                      props={invoiceData}
                    />
                    {/* {item.itemName} */}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="no-scroll"
                      value={item.quantity}
                      // pattern="[0-9]*"
                      onChange={(e) => handleInputChange(e, index, "quantity")}
                      // onWheel={(e) => e.preventDefault()}
                      onWheel={(event) => event.target.blur()}
                      placeholder="Quantity"
                    />
                  </td>
                  <td>{item.rate}</td>
                  <td>{item.gst}</td>
                  <td>{item.amount}</td>

                  <td>
                    <DeleteIcon
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDeleteRow(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bottom-controls">
            <button id="add-new-item" type="button" onClick={handleAddField}>
              <strong> Add New Row </strong>{" "}
            </button>
            <div className="discount-input">
              Discount (%):{" "}
              <input
                type="number"
                autocomplete="one-time-code"
                value={invoiceData.discount}
                onChange={(e) => handleInputChangeCust(e, "discount")}
                placeholder="Discount (%)"
                onWheel={(event) => event.target.blur()}
              />
            </div>
          </div>
          <div className="customer-notes">
            <label htmlFor="customerNotes">Customer Notes:</label>
            <br />
            <textarea
              id="customerNotes"
              value={invoiceData.notes}
              onChange={(e) => handleInputChangeCust(e, "notes")}
              placeholder="Enter notes here..."
              rows="4"
              cols="50"
            ></textarea>
          </div>
          <div className="total-amt-box" style={{ fontSize: "24px" }}>
            Total Amount: &#8377; {invoiceData.totalAmount}
          </div>
        </div>
        <div className="bill-buttons">
          <button id="add-as-credit" type="button" onClick={togglePaymentMode}>
            {" "}
            <strong> {isPaid ? "Add as Credit" : "Set as Paid"} </strong>{" "}
          </button>
          <button id="preview-bill" type="button" onClick={generatePdf}>
            {" "}
            <strong> Preview Bill </strong>{" "}
          </button>
          <button
            id="generate-bill-button"
            type="button"
            onClick={handleGenerateBill}
            disabled={showLoading} // Disable the button when loading
          >
            <strong> Generate Bill </strong>
          </button>
        </div>
      </div>
    </>
  );
};

export default AddNewInvoice;
