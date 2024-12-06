import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const ExistingEntry = ({
  isVisible,
  entryType,
  handleExistingEntryDialog,
  handlePageUpdate,
  amount,
  existingEntryName,
  existingEntryId,
}) => {
  const updateExisting = () => {
    if (entryType === "Customer") updateCustAmount();
    else updateSuppAmount();
  };

  const updateCustAmount = () => {
    fetch("https://billback.orbe.in/api/pendingTransactions/updateCustAmt", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        _id: existingEntryId,
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
    fetch("https://billback.orbe.in/api/pendingTransactions/updateSuppAmt", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        _id: existingEntryId,
        amount,
      }),
    })
      .then((result) => {
        alert("Transaction successful!");
        handlePageUpdate();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal
      isOpen={isVisible}
      contentLabel="Existing Entry"
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
      <p>
        There already exists a {entryType} with name '{existingEntryName}'
        associated with this email. Do you want to add this amount to{" "}
        {existingEntryName}'s log?
      </p>

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
          type="button"
          onClick={() => {
            handleExistingEntryDialog();
            updateExisting();
          }}
          style={{
            width: "45%",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={handleExistingEntryDialog}
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
          No
        </button>
      </div>
    </Modal>
  );
};

export default ExistingEntry;
