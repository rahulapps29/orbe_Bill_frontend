import React, { useState, useContext } from "react";
import "./AddProduct.css";
import AuthContext from "../../AuthContext";
const AddItemDialog = ({ isVisible, onCancel, handlePageUpdate }) => {
  const authContext = useContext(AuthContext);
  const [itemData, setItemData] = useState({
    userID: authContext.user,
    itemID: "",
    itemName: "",
    salePrice: "",
    costPrice: "",
    itemGST: "",
    category: "",
    discount: 0,
    quantity: 0,
  });
  const handleInputChange = (key, value) => {
    // Check if the value is numeric and not negative
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
  const addProduct = () => {
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
    fetch("https://billback.orbe.in/api/inventory/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(itemData),
    })
      .then((result) => {
        alert("Product ADDED");
        handlePageUpdate();

        //addProductModalSetting();
        onCancel();
        setItemData({
          // Resetting fields to initial state
          userID: authContext.user,
          itemID: "",
          itemName: "",
          salePrice: "",
          costPrice: "",
          itemGST: "",
          category: "",
          discount: 0,
          quantity: 0,
        });
      })
      .catch((err) => console.log(err));
  };
  const handleCancel = () => {
    onCancel();
    setItemData({
      // Resetting fields to initial state
      userID: authContext.user,
      itemID: "",
      itemName: "",
      salePrice: "",
      costPrice: "",
      itemGST: "",
      category: "",
      discount: 0,
      quantity: 0,
    });
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
                        required
                        id="item-name"
                        autocomplete="one-time-code"
                        placeholder="Item Name"
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
                        required
                        id="item-id"
                        autocomplete="one-time-code"
                        placeholder="Item ID"
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
                        required
                        id="sales-price"
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
                        required
                        id="cost-price"
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
                        required
                        id="category"
                        autocomplete="one-time-code"
                        placeholder="Category"
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
                        required
                        id="gst"
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
                onClick={addProduct}
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

export default AddItemDialog;
