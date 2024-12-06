import React, { useState, useEffect } from "react";
import "./AddProduct.css";
const AddBatchDialog = ({ isVisible, onCancel, element, handlePageUpdate }) => {
  useEffect(() => {
    setItemData((prevItemData) => ({
      ...prevItemData,
      _id: element,
      //   batchID: element,
    }));
  }, [element]);

  const [itemData, setItemData] = useState({
    _id: element,
    batchID: "",
    batchQty: "",
    expiryDate: "",
  });

  // console.log(element);

  const handleInputChange = (key, value) => {
    if (key === "batchQty") {
      // Check if the value is empty or a positive number
      if (
        (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) ||
        value === ""
      ) {
        // If the value is empty or a positive number, update the state
        setItemData({ ...itemData, [key]: value });
      } else {
        alert(
          "Invalid input: Please enter a valid non-negative numeric value."
        );
      }
    } else {
      // For other fields, update the state directly
      setItemData({ ...itemData, [key]: value });
    }
    // console.log(itemData);
  };
  const addBatch = () => {
    const { batchID, batchQty, expiryDate } = itemData; // Destructure itemData
    if (!itemData.batchID) {
      alert("Please enter batchID.");
      return; // Stop further execution
    }
    if (!itemData.batchQty) {
      alert("Please enter quantity.");
      return; // Stop further execution
    }
    if (!itemData.expiryDate) {
      alert("Please enter expiry date.");
      return; // Stop further execution
    }
    fetch("https://billback.orbe.in/api/inventory/addBatchList", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        _id: element, // Assuming element is the product ID
        batchID,
        batchQty,
        expiryDate,
      }),
    })
      .then((result) => {
        if (result.ok) {
          alert("Batch ADDED");
          handlePageUpdate();
          onCancel();
          setItemData({
            _id: element,
            batchID: "",
            batchQty: "",
            expiryDate: "",
          });
        } else {
          alert("Failed to add batch");
        }
      })
      .catch((err) => console.log(err));
  };
  const handleCancel = () => {
    onCancel();
    setItemData({
      _id: element,
      batchID: "",
      batchQty: "",
      expiryDate: "",
    });
  };

  useEffect(() => {
    // console.log("Updated itemData:", itemData);
  }, [itemData]);
  return (
    isVisible && (
      <div>
        <div className="blur-container-batch" />

        {/* Dialog background */}
        <div className="dialog-background-batch">
          <dialog open id="addItemDialog" style={{ height: "250px" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <table style={{ width: "100%", height: "110px" }}>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        id="item-name"
                        required
                        autocomplete="one-time-code"
                        placeholder="batchID"
                        value={itemData.batchID}
                        name="batchID"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id="item-id"
                        required
                        autocomplete="one-time-code"
                        placeholder="batchQty"
                        value={itemData.batchQty}
                        name="batchQty"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        type="date"
                        id="expiryDate"
                        required
                        autocomplete="one-time-code"
                        placeholder="expiryDate"
                        value={itemData.expiryDate}
                        name="expiryDate"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <button type="submit" onClick={addBatch}>
                Save
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </form>
          </dialog>
        </div>
      </div>
    )
  );
};

export default AddBatchDialog;
