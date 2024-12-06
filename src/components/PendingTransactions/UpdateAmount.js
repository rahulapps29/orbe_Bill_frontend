import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const UpdateAmt = ({
  isVisible,
  onCancel,
  entryType,
  operationType,
  entryID,
  amount,
  handlePageUpdate,
}) => {
  const [DisplayData, setDisplayData] = useState({
    amount: "",
  });

  const [Data, setData] = useState({
    amount: "",
  });

  const handleInputChange = (key, value) => {
    setData({ ...Data, [key]: value });
    setDisplayData({ ...DisplayData, [key]: value });
    // console.log(Data);
  };

  const setAmountSign = () => {
    if (operationType === "Subtraction")
      setData({
        ...Data,
        amount: Data.amount < 0 ? Data.amount : -Data.amount,
      });
    else
      setData({
        ...Data,
        amount: Data.amount > 0 ? Data.amount : -Data.amount,
      });
  };

  useEffect(() => {
    setAmountSign();
  }, [DisplayData]);

  const updateAmount = () => {
    // console.log(amount);
    // console.log(Data.amount);
    if (DisplayData.amount > 0) {
      if (Number(amount) + Number(Data.amount) >= 0) {
        if (DisplayData.amount > 0) {
          onCancel();
          setDisplayData({ amount: "" });
          if (entryType === "Customer") updateCustAmount();
          else updateSuppAmount();
        }
      } else {
        alert("Amount entered exceeds the pending amount");
      }
    } else alert("Please enter amount greater than zero");
    setDisplayData({ amount: "" });
    setData({ amount: "" });
  };

  const updateCustAmount = () => {
    const { amount } = Data;
    fetch("https://billback.orbe.in/api/pendingTransactions/updateCustAmt", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        _id: entryID,
        amount,
      }),
    })
      .then((result) => {
        alert("Transaction successful!");
        handlePageUpdate();
      })
      .catch((err) => console.log(err));
  };

  const updateSuppAmount = () => {
    const { amount } = Data;
    fetch("https://billback.orbe.in/api/pendingTransactions/updateSuppAmt", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        _id: entryID,
        amount,
      }),
    })
      .then((result) => {
        alert("Transaction successful!");
        handlePageUpdate();
      })
      .catch((err) => console.log(err));
  };
  const handleCancel = () => {
    onCancel();
    setData({
      amount: "",
      // Resetting fields to initial state
    });
    setDisplayData({
      amount: "",
      // Resetting fields to initial state
    });
  };

  return (
    <Modal
      isOpen={isVisible}
      contentLabel="Update Amount Dialog"
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Adjust overlay opacity as needed
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          width: "400px", // Adjust modal width as desired
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "5px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <h2>Amount:</h2> {/* Heading */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateAmount();
          onCancel();
        }}
      >
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="amount">Enter Amount:</label>
          <input
            type="number"
            autocomplete="one-time-code"
            value={DisplayData.amount}
            name="amount"
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            onWheel={(event) => event.target.blur()}
            className="form-control"
            style={{
              width: "90%",
              padding: "5px 10px",
              border: "1px solid #ccc",
              borderRadius: "3px",
            }}
          />
        </div>

        <div
          className="button-group"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "10px 0 5px",
          }}
        >
          <button
            type="submit"
            style={{
              width: "45%",
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              width: "45%",
              backgroundColor: "#eee",
              color: "#333",
              border: "1px solid #ccc",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>

        {/* <button type="submit">
              Submit
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button> */}
      </form>
    </Modal>
  );
};

export default UpdateAmt;
