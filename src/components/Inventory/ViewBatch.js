import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import { Link } from "react-router-dom";
import UpdateBatchDialog from "./UpdateBatch";
import DeleteIcon from "@mui/icons-material/Delete";

const ViewBatchDialog = ({
  isVisible,
  onCancel,
  batches,
  id,
  handlePageUpdate,
}) => {
  const productId = id;
  const [updateBatch, setUpdateBatch] = useState([]);
  const [isUpdateBatchDialogVisible, setUpdateBatchDialogVisibility] =
    useState(false);
  const [updatePage1, setUpdatePage1] = useState(true);
  const [batchList, setBatchList] = useState(batches);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [batchIdToDelete, setBatchIdToDelete] = useState(null);
  // console.log(batches);

  useEffect(() => {
    setBatchList(batches);
  }, [batches]);
  const handleUpdateBatchList = (updatedBatchList) => {
    setBatchList(updatedBatchList);
  };

  const deleteBatch = (Batchid) => {
    // console.log("Batch ID: ", Batchid);
    setBatchIdToDelete(Batchid);
    setConfirmationOpen(true);
  };

  const confirmDelete = () => {
    // Call the deleteBatch function when the user confirms
    fetch(
      `https://billback.orbe.in/api/inventory/deleteBatch/${id}/${batchIdToDelete}`,
      {
        method: "GET", // or 'DELETE' depending on your server implementation
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const updatedBatchList = batchList.filter(
          (batch) => batch._id !== batchIdToDelete
        );
        setBatchList(updatedBatchList);
        handlePageUpdate();
        setUpdatePage1(!updatePage1);
        setConfirmationOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handlePageUpdate1 = () => {
    setUpdatePage1(!updatePage1);
  };

  const toggleUpdateBatchDialog = () => {
    setUpdateBatchDialogVisibility(!isUpdateBatchDialogVisible);
  };

  const updateBatchModalSetting = (selectedProductData) => {
    // console.log("Clicked: edit");
    setUpdateBatch(selectedProductData);
    toggleUpdateBatchDialog();
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-IN", options);
  };

  return (
    isVisible && (
      <div>
        <div className="blur-container-batch" />

        {/* Dialog background */}
        <div className="dialog-background-batch">
          <dialog open id="addItemDialog">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <UpdateBatchDialog
                isVisible={isUpdateBatchDialogVisible}
                on_Cancel={toggleUpdateBatchDialog}
                element={updateBatch}
                id={productId}
                handlePageUpdate={handlePageUpdate}
                handlePageUpdate1={handlePageUpdate1}
                onUpdateSaved={handleUpdateBatchList}
              />
              {isConfirmationOpen && (
                <div className="confirmation-dialog">
                  <p>Are you sure you want to delete this batch?</p>
                  <button
                    onClick={confirmDelete}
                    style={{ marginLeft: "20px" }}
                  >
                    Yes
                  </button>
                  <button onClick={() => setConfirmationOpen(false)}>No</button>
                </div>
              )}

              <table id="inventoryTable">
                <thead>
                  <tr className="headers">
                    <th>BATCH ID</th>
                    <th>BATCH QUANTITY</th>
                    <th>BATCH EXPIRY</th>
                    <th>MORE ACTIONS </th>
                    <th>DELETE</th>
                  </tr>
                </thead>
                <tbody>
                  {batchList &&
                    batchList.map((element, index) => {
                      return (
                        <tr key={index}>
                          <td>{element.batchID}</td>
                          <td>{element.batchQty}</td>
                          <td>{formatDate(element.expiryDate)}</td>
                          <td>
                            <span
                              className="action-button"
                              onClick={() => updateBatchModalSetting(element)}
                            >
                              EditBatch{" "}
                            </span>
                          </td>
                          <td>
                            <span>
                              <DeleteIcon
                                style={{ color: "red", cursor: "pointer" }}
                                onClick={() => deleteBatch(element._id)}
                              />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <button
                type="button"
                style={{ marginLeft: "300px" }}
                onClick={onCancel}
              >
                Cancel
              </button>
            </form>
          </dialog>
        </div>
      </div>
    )
  );
};

export default ViewBatchDialog;
