import React, { useState, useEffect, useContext } from "react";
import "./Inventory.css";
import { Link, Navigate } from "react-router-dom";
import AddItemDialog from "./components/Inventory/AddProduct";
import UpdateItemDialog from "./components/Inventory/UpdateProduct";
import AddBatchDialog from "./components/Inventory/AddBatch";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewBatchDialog from "./components/Inventory/ViewBatch";
import AuthContext from "./AuthContext";
import Navbar from "./Navbar";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ViewListIcon from "@mui/icons-material/ViewList";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
const Inventory = () => {
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("");
  const [isAddItemDialogVisible, setAddItemDialogVisibility] = useState(false);
  const [isUpdateItemDialogVisible, setUpdateItemDialogVisibility] =
    useState(false);
  const [isViewBatchDialogVisible, setViewBatchDialogVisibility] =
    useState(false);
  const [isAddBatchDialogVisible, setAddBatchDialogVisibility] =
    useState(false);
  const [products, setAllProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [addBatch, setAddBatch] = useState([]);
  const [updateBatch, setUpdateBatch] = useState([]);
  const [itemName, setItemName] = useState();
  const [searchInput, setSearchInput] = useState("");
  const authContext = useContext(AuthContext);
  // console.log(authContext.user);
  // useEffect(() => {
  //   // Sort products whenever the products state changes
  //   sortProducts(sortBy);
  // }, [products]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.itemName.toLowerCase().includes(searchInput.toLowerCase())
  );

  const toggleAddItemDialog = () => {
    setAddItemDialogVisibility(!isAddItemDialogVisible);
    // console.log({isAddItemDialogVisible});
  };
  const toggleUpdateItemDialog = () => {
    setUpdateItemDialogVisibility(!isUpdateItemDialogVisible);
    // console.log({isUpdateItemDialogVisible});
  };
  const toggleViewBatchDialog = () => {
    setViewBatchDialogVisibility(!isViewBatchDialogVisible);
    // console.log({isViewBatchDialogVisible});
  };
  const toggleAddBatchDialog = () => {
    setAddBatchDialogVisibility(!isAddBatchDialogVisible);
    // console.log({isAddBatchDialogVisible});
  };
  const updateProductModalSetting = (selectedProductData) => {
    // console.log("Clicked: edit");
    setUpdateProduct(selectedProductData);
    toggleUpdateItemDialog();
  };
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const addBatchModalSetting = (selectedProductData) => {
    // console.log("Clicked:add batch");
    // console.log(selectedProductData);
    setAddBatch(selectedProductData._id);
    toggleAddBatchDialog();
  };
  const viewBatchModalSetting = (selectedProductData) => {
    // console.log("Clicked:update batch");
    setUpdateBatch(selectedProductData);
    toggleViewBatchDialog();
  };
  const getRowStyle = (expiryDate) => {
    const today = new Date();
    const expirationDate = new Date(expiryDate);
    const daysUntilExpiration = Math.floor(
      (expirationDate - today) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiration < 0) {
      // Item has already expired
      return { backgroundColor: "pink" };
    } else if (daysUntilExpiration <= 3) {
      // Item will expire soon
      return { backgroundColor: "#FFF59D" };
    } else {
      // Item is not expiring soon and not expired
      return { backgroundColor: "#E0FFDB" };
      // return {};
    }
  };

  useEffect(() => {
    fetchProductsData();
    sortProducts(sortBy);
    // fetchSalesData();
  }, [updatePage]);
  const fetchProductsData = () => {
    fetch(`https://billback.orbe.in/api/inventory/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  };
  const fetchSearchData = () => {
    fetch(
      `https://billback.orbe.in/api/inventory/search/${authContext.user}?itemName=${itemName}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  };
  const handleItemName = (e) => {
    setItemName(e.target.value);
    fetchSearchData();
  };

  const deleteItem = (id) => {
    console.log("Product ID: ", id);
    fetch(`https://billback.orbe.in/api/inventory/delete/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdatePage(!updatePage);
      });
  };
  const sortProducts = (heading) => {
    const sortedProducts = [...products];
    let newSortDirection;

    // if (sortBy === heading) {
    //   // If already sorted by the same heading, reverse the order
    //   sortedProducts.reverse();
    //   // Toggle the direction of the arrow
    //   newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    // } else {
    // Sort the products based on the selected heading
    if (sortBy === heading) {
      // If already sorted by the same heading, toggle the direction
      sortedProducts.sort((a, b) => {
        let valueA, valueB;
        if (heading === "itemName" || heading === "itemID") {
          valueA = a[heading].toLowerCase();
          valueB = b[heading].toLowerCase();
        } else {
          valueA = a[heading];
          valueB = b[heading];
        }

        if (valueA < valueB) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
      newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      // Sort the products based on the selected heading
      sortedProducts.sort((a, b) => {
        let valueA, valueB;
        if (heading === "itemName" || heading === "itemID") {
          valueA = a[heading].toLowerCase();
          valueB = b[heading].toLowerCase();
        } else {
          valueA = a[heading];
          valueB = b[heading];
        }

        if (sortDirection === "asc") {
          if (valueA < valueB) {
            return -1;
          }
          if (valueA > valueB) {
            return 1;
          }
        } else {
          // sortDirection === 'desc'
          if (valueA > valueB) {
            return -1;
          }
          if (valueA < valueB) {
            return 1;
          }
        }
        return 0;
      });
      // Toggle the direction
      newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    // Update state variables
    setAllProducts(sortedProducts);
    setSortBy(heading); // Update the state to track the selected heading
    setSortDirection(newSortDirection); // Update the arrow direction
  };
  const auth = useContext(AuthContext);
  if (!auth.user) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="Inventory">
      <Navbar />
      <div className="main-container">
        <div className="add-button-container">
          <button className="add-item-button" onClick={toggleAddItemDialog}>
            <strong> Add New Item </strong>
          </button>
        </div>
        <AddItemDialog
          isVisible={isAddItemDialogVisible}
          onCancel={toggleAddItemDialog}
          handlePageUpdate={handlePageUpdate}
        />
        <UpdateItemDialog
          isVisible={isUpdateItemDialogVisible}
          onCancel={toggleUpdateItemDialog}
          element={updateProduct}
          handlePageUpdate={handlePageUpdate}
        />
        <AddBatchDialog
          isVisible={isAddBatchDialogVisible}
          onCancel={toggleAddBatchDialog}
          element={addBatch}
          handlePageUpdate={handlePageUpdate}
        />
        <ViewBatchDialog
          isVisible={isViewBatchDialogVisible}
          onCancel={toggleViewBatchDialog}
          batches={updateBatch.batchList}
          id={updateBatch._id}
          handlePageUpdate={handlePageUpdate}
        />
        <div className="top">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search"
              style={{ fontFamily: "Libre Baskerville" }}
              // value={itemName}
              // onChange={handleItemName}
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <SearchIcon className="search-icon" />
            {/* <div className="circle" /> */}
          </div>
        </div>
        <table id="inventoryTable">
          <thead>
            <tr className="headers">
              <th>
                ITEM ID
                <button onClick={() => sortProducts("itemID")}>
                  {/* Arrow icon */}
                  {sortBy === "itemID" ? (
                    sortDirection === "asc" ? (
                      <>&uarr;</>
                    ) : (
                      <>&darr;</>
                    )
                  ) : (
                    <>&darr;</>
                  )}
                </button>
              </th>
              <th>
                ITEM NAME
                <button onClick={() => sortProducts("itemName")}>
                  {/* Arrow icon */}
                  {sortBy === "itemName" ? (
                    sortDirection === "asc" ? (
                      <>&uarr;</>
                    ) : (
                      <>&darr;</>
                    )
                  ) : (
                    <>&darr;</>
                  )}
                </button>
              </th>
              <th>
                SALE PRICE
                <button onClick={() => sortProducts("salePrice")}>
                  {/* Arrow icon */}
                  {sortBy === "salePrice" ? (
                    sortDirection === "asc" ? (
                      <>&uarr;</>
                    ) : (
                      <>&darr;</>
                    )
                  ) : (
                    <>&darr;</>
                  )}
                </button>
              </th>
              <th>
                COST PRICE
                <button onClick={() => sortProducts("costPrice")}>
                  {/* Arrow icon */}
                  {sortBy === "costPrice" ? (
                    sortDirection === "asc" ? (
                      <>&uarr;</>
                    ) : (
                      <>&darr;</>
                    )
                  ) : (
                    <>&darr;</>
                  )}
                </button>
              </th>
              <th>
                STOCK
                <button onClick={() => sortProducts("quantity")}>
                  {/* Arrow icon */}
                  {sortBy === "quantity" ? (
                    sortDirection === "asc" ? (
                      <>&uarr;</>
                    ) : (
                      <>&darr;</>
                    )
                  ) : (
                    <>&darr;</>
                  )}
                </button>
              </th>
              <th>MORE ACTIONS</th>
              {/* <th>DELETE</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((element, index) => (
              /* {products && products.map((element, index) => { */
              // return
              <tr
                key={element._id}
                style={{
                  ...getRowStyle(element.batchList[0]?.expiryDate),
                  marginBottom: "20px",
                  borderBottom: "4px solid white",
                }}
              >
                <td style={{ padding: "15px 0" }}>{element.itemID}</td>
                <td style={{ padding: "15px 0" }}>{element.itemName}</td>
                <td style={{ padding: "15px 0" }}>{element.salePrice}</td>
                <td style={{ padding: "15px 0" }}>{element.costPrice}</td>
                <td style={{ padding: "15px 0" }}>{element.quantity}</td>
                <td>
                  <span
                    className="action-button"
                    //className="text-green-700 cursor-pointer"
                    onClick={() => updateProductModalSetting(element)}
                  >
                    {/* EditItem{" "} */}
                    <Tooltip title="Edit Item">
                      <ModeEditIcon />
                    </Tooltip>
                  </span>
                  <span
                    className="action-button"
                    //className="text-green-700 cursor-pointer"
                    onClick={() => addBatchModalSetting(element)}
                  >
                    <Tooltip title="Add Batch">
                      <AddIcon />
                    </Tooltip>
                  </span>
                  <span
                    className="action-button"
                    //className="text-green-700 cursor-pointer"
                    onClick={() => viewBatchModalSetting(element)}
                  >
                    {/* ViewBatch{" "} */}
                    <Tooltip title="View Batch">
                      <ViewListIcon />
                    </Tooltip>
                  </span>
                  <span
                    className="action-button"

                    //className="text-red-600 px-2 cursor-pointer"
                    //onClick={() => deleteItem(element._id)}
                  >
                    <Tooltip title="Delete Item">
                      <DeleteIcon
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => deleteItem(element._id)}
                      />
                    </Tooltip>
                  </span>
                </td>
                {/* <td> 
            <span
            
              //className="text-red-600 px-2 cursor-pointer"
              //onClick={() => deleteItem(element._id)}
            >
              <DeleteIcon
                  style={{ color: 'red', cursor: 'pointer' }}
                  onClick={() => deleteItem(element._id)}
                />
            </span>
          </td>  */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory; // main inventory.js
