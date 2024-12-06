import React, { useState, useEffect, useContext } from "react";
import "./Pending transactions.css";
import AddNewEntry from "./components/PendingTransactions/AddNewEntry";
import UpdateEntry from "./components/PendingTransactions/UpdateEntry";
import UpdateAmt from "./components/PendingTransactions/UpdateAmount";
import EditIcon from "@mui/icons-material/Edit";
import { Link, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import AuthContext from "./AuthContext";

const PendingTransactions = () => {
  const [activeTab, setActiveTab] = useState("credit-tab");
  const [Entries, setEntries] = useState([]);
  const authContext = useContext(AuthContext);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("");
  const openTab = (tabName) => {
    setActiveTab(tabName);
    handlePageUpdate();
  };
  const sortEntries = (columnName) => {
    const sortedEntries = [...Entries];
    let newSortOrder;

    if (sortBy === columnName) {
      // If already sorted by the same column, reverse the order
      sortedEntries.sort((a, b) => {
        let valueA, valueB;
        if (columnName === "name") {
          valueA = a[columnName].toLowerCase();
          valueB = b[columnName].toLowerCase();
        } else {
          valueA = a[columnName];
          valueB = b[columnName];
        }

        if (valueA < valueB) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
      newSortOrder = sortDirection === "asc" ? "desc" : "asc";
    } else {
      // Sort the entries based on the selected column
      sortedEntries.sort((a, b) => {
        let valueA, valueB;
        if (columnName === "name") {
          valueA = a[columnName].toLowerCase();
          valueB = b[columnName].toLowerCase();
        } else {
          valueA = a[columnName];
          valueB = b[columnName];
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
      newSortOrder = sortDirection === "asc" ? "desc" : "asc";
    }

    // Update state variables
    setEntries(sortedEntries);
    setSortBy(columnName); // Update the state to track the selected column
    setSortDirection(newSortOrder); // Update the arrow direction
  };
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredEntries = Entries.filter((Entry) =>
    Entry.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  //const userID = "user";
  const userID = authContext.user;
  const [updatePage, setUpdatePage] = useState(true);

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const fetchEntriesData = () => {
    if (activeTab === "credit-tab") fetchCreditCustomers();
    else fetchDebitSuppliers();
  };

  const fetchCreditCustomers = () => {
    fetch(`https://billback.orbe.in/api/pendingTransactions/getCust/${userID}`)
      .then((response) => response.json())
      .then((data) => {
        setEntries(data);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchDebitSuppliers = () => {
    fetch(`https://billback.orbe.in/api/pendingTransactions/getSupp/${userID}`)
      .then((response) => response.json())
      .then((data) => {
        setEntries(data);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const SearchCreditCustomers = (query) => {
    const q = query;
    // const userID = "user";
    fetch(
      `https://billback.orbe.in/api/pendingTransactions/SearchCreditCust/${userID}?custName=${q}`
    )
      .then((response) => response.json())
      .then((data) => {
        setEntries(data);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const SearchDebitSuppliers = (query) => {
    const q = query;
    // const userID = "user";
    fetch(
      `https://billback.orbe.in/api/pendingTransactions/SearchDebitSupp/${userID}?suppName=${q}`
    )
      .then((response) => response.json())
      .then((data) => {
        setEntries(data);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const [entryType, setEntryType] = useState("Customer");
  const [operationType, setOperationType] = useState("Subtraction");
  const [entryID, setEntryID] = useState([]);
  const [entry, setEntry] = useState([]);
  const [isUpdateAmtDialogOpen, setIsUpdateAmtDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");

  const showUpdateAmtDialog = () => {
    setIsUpdateAmtDialogOpen(true);
  };

  const hideUpdateAmtDialog = () => {
    setIsUpdateAmtDialogOpen(false);
  };

  const [isAddNewDialogOpen, setIsAddNewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const showAddNewDialog = () => {
    setIsAddNewDialogOpen(true);
  };
  const showUpdateDialog = () => {
    setIsUpdateDialogOpen(true);
  };
  const hideAddNewDialog = () => {
    setIsAddNewDialogOpen(false);
  };
  const hideUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  const [totalAmt, setTotalAmt] = useState(0);

  const handleTotalAmt = () => {
    if (query === "") {
      const amounts =
        activeTab === "credit-tab"
          ? Entries.map((Entry) => Entry.creditAmount)
          : Entries.map((Entry) => Entry.debitAmount);
      const total = amounts.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      setTotalAmt(total.toFixed(2));
    }
  };

  useEffect(() => {
    handleTotalAmt();
  }, [Entries]);

  useEffect(() => {
    if (query === "") fetchEntriesData();
    else {
      if (activeTab === "credit-tab") SearchCreditCustomers(query);
      else SearchDebitSuppliers(query);
    }
  }, [query]);

  useEffect(() => {
    if (query === "") fetchEntriesData();
    else {
      if (activeTab === "credit-tab") SearchCreditCustomers(query);
      else SearchDebitSuppliers(query);
    }
  }, [updatePage]);

  const auth = useContext(AuthContext);
  if (!auth.user) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="PendingTrans">
      <Navbar />
      <div className="main-container">
        <div className="top">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </div>
          <div className="TotalAmount">
            {activeTab === "credit-tab" ? "Total Credit:" : "Total Debit:"}
            {"   "}
            {totalAmt}
          </div>
        </div>
      </div>

      <div className="credit-debit-heading">
        <button
          className={
            activeTab === "credit-tab" ? "active-tablinks" : "tablinks"
          }
          onClick={() => openTab("credit-tab")}
        >
          <h2>Credit</h2>
        </button>
        <button
          className={activeTab === "debit-tab" ? "active-tablinks" : "tablinks"}
          onClick={() => openTab("debit-tab")}
        >
          <h2>Debit</h2>
        </button>
      </div>

      <div
        id="credit-tab"
        className={
          activeTab === "credit-tab" ? "tabcontent-active" : "tabcontent"
        }
      >
        <table id="inventoryTable">
          <thead style={{ backgroundColor: "lightly" }}>
            <tr className="headers">
              <th>
                CustomerName
                <button onClick={() => sortEntries("name")}>
                  {/* Arrow icon */}
                  {sortBy === "name" ? (
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
                Phone No
                <button onClick={() => sortEntries("phoneNo")}>
                  {/* Arrow icon */}
                  {sortBy === "phoneNo" ? (
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
                Email
                <button onClick={() => sortEntries("email")}>
                  {/* Arrow icon */}
                  {sortBy === "email" ? (
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
                Amount
                <button onClick={() => sortEntries("creditAmount")}>
                  {/* Arrow icon */}
                  {sortBy === "creditAmount" ? (
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
              <th
                id="add-new"
                style={{ backgroundColor: "#c4dcf4" }}
                onClick={() => {
                  setEntryType("Customer");
                  showAddNewDialog();
                }}
              >
                Add New Customer
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {Entries &&
              Entries.map((element, index) => { */}
            {filteredEntries.map((element, index) => (
              // return (
              <tr
                key={element._id}
                // style={{ borderBottom: "1px solid lightgray" }}
              >
                <td>{element.name}</td>
                <td>{element.phoneNo}</td>
                <td>{element.email}</td>
                <td>
                  {element.creditAmount !== undefined
                    ? element.creditAmount.toFixed(2)
                    : ""}
                </td>
                <td>
                  {" "}
                  <button
                    className="add-credit-button"
                    onClick={() => {
                      setEntryType("Customer");
                      setEntryID(element._id);
                      setAmount(element.creditAmount);
                      setOperationType("Subtraction");
                      showUpdateAmtDialog();
                    }}
                  >
                    Clear Dues
                  </button>
                  {"  "}{" "}
                  <button
                    className="add-credit-button"
                    onClick={() => {
                      setEntryType("Customer");
                      setEntryID(element._id);
                      setAmount(element.creditAmount);
                      setOperationType("Addition");
                      showUpdateAmtDialog();
                    }}
                  >
                    Add to Credit
                  </button>{" "}
                  <EditIcon
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => {
                      setEntryType("Customer");
                      setEntry(element);
                      showUpdateDialog();
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        id="debit-tab"
        className={
          activeTab === "debit-tab" ? "tabcontent-active" : "tabcontent"
        }
      >
        <table id="inventoryTable">
          <thead>
            <tr className="headers">
              <th>
                Suppliers Name
                <button onClick={() => sortEntries("name")}>
                  {/* Arrow icon */}
                  {sortBy === "name" ? (
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
                Phone No
                <button onClick={() => sortEntries("phoneNo")}>
                  {/* Arrow icon */}
                  {sortBy === "phoneNo" ? (
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
                Email
                <button onClick={() => sortEntries("email")}>
                  {/* Arrow icon */}
                  {sortBy === "email" ? (
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
                Amount
                <button onClick={() => sortEntries("debitAmount")}>
                  {/* Arrow icon */}
                  {sortBy === "debitAmount" ? (
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
              <th
                id="add-new"
                style={{ backgroundColor: "#c4dcf4" }}
                onClick={() => {
                  setEntryType("Supplier");
                  showAddNewDialog();
                }}
              >
                Add New Supplier
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries &&
              filteredEntries.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td>{element.name}</td>
                    <td>{element.phoneNo}</td>
                    <td>{element.email}</td>
                    <td>
                      {element.debitAmount !== undefined
                        ? element.debitAmount.toFixed(2)
                        : ""}
                    </td>
                    <td>
                      {" "}
                      <button
                        className="add-credit-button"
                        onClick={() => {
                          setEntryType("Supplier");
                          setEntryID(element._id);
                          setAmount(element.debitAmount);
                          setOperationType("Subtraction");
                          showUpdateAmtDialog();
                        }}
                      >
                        Remove Amount
                      </button>
                      {"  "}{" "}
                      <button
                        className="add-credit-button"
                        onClick={() => {
                          setEntryType("Supplier");
                          setEntryID(element._id);
                          setAmount(element.debitAmount);
                          setOperationType("Addition");
                          showUpdateAmtDialog();
                        }}
                      >
                        Add Amount
                      </button>{" "}
                      <EditIcon
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => {
                          setEntryType("Supplier");
                          setEntry(element);
                          showUpdateDialog();
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <AddNewEntry
        isVisible={isAddNewDialogOpen}
        onCancel={hideAddNewDialog}
        addNewDialog={showAddNewDialog}
        entryType={entryType}
        handlePageUpdate={handlePageUpdate}
        id={userID}
      />

      <UpdateEntry
        isVisible={isUpdateDialogOpen}
        onCancel={hideUpdateDialog}
        entryType={entryType}
        entry={entry}
        handlePageUpdate={handlePageUpdate}
      />

      <UpdateAmt
        isVisible={isUpdateAmtDialogOpen}
        onCancel={hideUpdateAmtDialog}
        entryType={entryType}
        operationType={operationType}
        entryID={entryID}
        amount={amount}
        handlePageUpdate={handlePageUpdate}
      />
    </div>
  );
};
export default PendingTransactions;
