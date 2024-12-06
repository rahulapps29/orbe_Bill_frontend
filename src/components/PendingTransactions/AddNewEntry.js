import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ExistingEntry from "./ExistingEntry";

const AddNewEntry = ({
  isVisible,
  onCancel,
  addNewDialog,
  entryType,
  handlePageUpdate,
  id,
}) => {
  const [Data, setData] = useState({
    userID: "",
    partyName: "",
    phoneNumber: "",
    email: "",
    amount: "",
  });

  const [existingEntry, setExistingEntry] = useState(null);
  const [existingEntryDialog, setExistingEntryDialog] = useState(false);

  const hideExistingEntryDialog = () => {
    setExistingEntryDialog(false);
  };

  const openExistingEntryDialog = () => {
    setExistingEntryDialog(true);
  };

  const [email, setEmail] = useState("");
  const [callSave, setcallSave] = useState(false);

  const toggleCallSave = () => {
    setcallSave(!callSave);
  };

  const handleInputChange = (key, value) => {
    setData({ ...Data, userID: id, [key]: value });
    if (key === "email") setEmail(value);
    // console.log(Data);
  };

  const findExistingEntry = async () => {
    if (entryType === "Customer") {
      await fetch(
        `https://billback.orbe.in/api/pendingTransactions/getCustExistingEmail/${id}?email=${email}`
      )
        .then((response) => response.json())
        .then((data) => {
          setExistingEntry(data);
          // console.log(data);
        })
        .catch((err) => console.log(err));

      toggleCallSave();
    } else {
      await fetch(
        `https://billback.orbe.in/api/pendingTransactions/getSuppExistingEmail/${id}?email=${email}`
      )
        .then((response) => response.json())
        .then((data) => {
          setExistingEntry(data);
          // console.log(data);
        })
        .catch((err) => console.log(err));

      toggleCallSave();
    }
  };
  const handleCancel = () => {
    onCancel();
    setData({
      userID: "",
      partyName: "",
      phoneNumber: "",
      email: "",
      amount: "",
      // Resetting fields to initial state
    });
  };

  const handleSave = () => {
    // console.log(existingEntry);
    if (email !== "") {
      if (!existingEntry) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Data.email)) {
          if (
            Data.phoneNumber.length === 10 &&
            /^\d+$/.test(Data.phoneNumber)
          ) {
            if (Data.amount > 0) {
              if (entryType === "Customer") addNewCredit();
              else addNewDebit();
            } else {
              handleCancel();
              alert("Please enter amount greater than zero");
              //addNewDialog();
            }
          } else {
            handleCancel();
            alert("Phone Number must be a 10-digit number");
          }
        } else {
          handleCancel();
          alert("Please enter valid email");
        }
      } else {
        // console.log(existingEntry);
        if (Data.amount > 0) {
          openExistingEntryDialog();
        } else alert("Please enter amount greater than zero");
        onCancel();
      }
      // setData({userID: id, partyName: "", phoneNumber: "", email: "", amount: '' });
      // setEmail("");
      // setExistingEntry(null);
    }
  };

  const addNewCredit = () => {
    fetch(`https://billback.orbe.in/api/pendingTransactions/addNewCredit`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(Data),
    })
      .then((result) => {
        alert("Successfully added new customer!");
        handlePageUpdate();
        onCancel();
        setData({
          userID: id,
          partyName: "",
          phoneNumber: "",
          email: "",
          amount: "",
        });
        setEmail("");
      })
      .catch((err) => console.log(err));
  };

  const addNewDebit = () => {
    fetch("https://billback.orbe.in/api/pendingTransactions/addNewDebit", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(Data),
    })
      .then((result) => {
        alert("Successfully added new supplier!");
        handlePageUpdate();
        onCancel();
        setData({
          userID: id,
          partyName: "",
          phoneNumber: "",
          email: "",
          amount: "",
        });
        setEmail("");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    handleSave();
  }, [callSave]);

  return (
    <div>
      <Modal
        isOpen={isVisible}
        contentLabel="New Entry Dialog"
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 3, // Adjust overlay opacity as needed
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
            zIndex: 2,
          },
        }}
      >
        <h2>New Entry</h2> {/* Heading */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            findExistingEntry();
            onCancel();
          }}
        >
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="customerName">Name:</label>
            <input
              type="text"
              autocomplete="one-time-code"
              value={Data.partyName}
              required
              name="partyName"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              className="form-control"
              style={{
                width: "90%",
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="phoneNo">Phone Number:</label>
            <input
              type="text"
              autocomplete="one-time-code"
              value={Data.phoneNumber}
              required
              name="phoneNumber"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              className="form-control"
              style={{
                width: "90%",
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="Email">Email:</label>
            <input
              type="text"
              autocomplete="one-time-code"
              value={Data.email}
              required
              name="email"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              className="form-control"
              style={{
                width: "90%",
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              autocomplete="one-time-code"
              value={Data.amount}
              required
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
              Save
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
        </form>
      </Modal>

      {existingEntry && (
        <ExistingEntry
          isVisible={existingEntryDialog}
          entryType={entryType}
          handleExistingEntryDialog={hideExistingEntryDialog}
          handlePageUpdate={handlePageUpdate}
          amount={Data.amount}
          existingEntryName={existingEntry.name}
          existingEntryId={existingEntry._id}
        />
      )}
    </div>
  );
};

export default AddNewEntry;
