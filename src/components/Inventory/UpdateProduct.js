import React, { useState, useEffect } from "react";
import "./AddProduct.css";
const UpdateItemDialog = ({
  isVisible,
  onCancel,
  element,
  handlePageUpdate,
}) => {
  useEffect(() => {
    setItemData((prevItemData) => ({
      ...prevItemData,
      _id: element._id,
      itemID: element.itemID,
      itemName: element.itemName,
      salePrice: element.salePrice,
      costPrice: element.costPrice,
      itemGST: element.itemGST,
      category: element.category,
      discount: element.discount,
      quantity: element.quantity,
    }));
  }, [element]);
  const [itemData, setItemData] = useState({
    _id: "",
    itemID: "",
    itemName: "",
    salePrice: "",
    costPrice: "",
    itemGST: "",
    category: "",
    discount: "",
    quantity: "",
    // batchList: [],
  });

  const handleInputChange = (key, value) => {
    if (key === "costPrice" || key === "salePrice" || key === "itemGST") {
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
  const updateProduct = () => {
    if (
      !itemData.itemID ||
      !itemData.category ||
      !itemData.itemGST ||
      !itemData.costPrice ||
      !itemData.salePrice ||
      !itemData.itemName
    ) {
      alert("Please enter all the details.");
      return; // Stop further execution
    }
    fetch("https://billback.orbe.in/api/inventory/update", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(itemData),
    })
      .then((result) => {
        alert("Product UPDATED");
        //resetFields();
        handlePageUpdate();
        //addProductModalSetting();
        onCancel();
      })
      .catch((err) => console.log(err));
  };
  const handleCancel = () => {
    onCancel();
    setItemData({
      // Resetting fields to initial state
      _id: element._id,
      itemID: element.itemID,
      itemName: element.itemName,
      salePrice: element.salePrice,
      costPrice: element.costPrice,
      itemGST: element.itemGST,
      category: element.category,
      discount: element.discount,
      quantity: element.quantity,
    });
    //resetFields();
  };
  return (
    isVisible && (
      <div>
        <div className="blur-container" />
        <div className="dialog-background">
          <dialog open id="addItemDialog">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <td className="label-cell">Item Name:</td>
                    <td>
                      <input
                        type="text"
                        className="read-only-input"
                        id="item-name"
                        autocomplete="one-time-code"
                        placeholder="Item Name"
                        readOnly
                        value={itemData.itemName}
                        name="itemName"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                      />
                    </td>
                    <td className="label-cell">Item ID:</td>
                    <td>
                      <input
                        type="text"
                        className="read-only-input"
                        id="item-id"
                        autocomplete="one-time-code"
                        placeholder="Item ID"
                        readOnly
                        value={itemData.itemID}
                        name="itemID"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="label-cell">salePrice:</td>
                    <td>
                      <input
                        type="number"
                        id="sales-price"
                        required
                        autocomplete="one-time-code"
                        placeholder="Sales Price/unit"
                        value={itemData.salePrice}
                        name="salePrice"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                      />
                    </td>

                    <td className="label-cell">costPrice:</td>
                    <td>
                      <input
                        type="number"
                        id="cost-price"
                        required
                        autocomplete="one-time-code"
                        placeholder="Cost Price/unit"
                        value={itemData.costPrice}
                        name="costPrice"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="label-cell">Category:</td>
                    <td>
                      <input
                        type="text"
                        className="read-only-input"
                        id="category"
                        autocomplete="one-time-code"
                        placeholder="Category"
                        readOnly
                        value={itemData.category}
                        name="category"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                      />
                    </td>
                    <td className="label-cell">GST (%):</td>
                    <td>
                      <input
                        type="number"
                        id="gst"
                        required
                        autocomplete="one-time-code"
                        placeholder="GST"
                        value={itemData.itemGST}
                        name="itemGST"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                type="submit"
                onClick={updateProduct}
                style={{ marginLeft: "100px" }}
              >
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

export default UpdateItemDialog;
