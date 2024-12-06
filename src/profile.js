import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./profile.css";
import AuthContext from "./AuthContext";

function Profile() {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    gstno: "",
    shopname: "",
    shopaddress: "",
    phonenumber: "",
  });
  const [editable, setEditable] = useState(false); // State to manage edit mode
  const [formData, setFormData] = useState({}); // State to store form data
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const getUserData = () => {
    fetch(`https://billback.orbe.in/api/user/get/${authContext.user}`, {
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
        setUserData(data);
        setFormData(data); // Initialize form data with user data
      })
      .catch((error) => {
        console.log("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleEditClick = () => {
    setEditable(true); // Enable edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
  };

  const handleSaveClick = () => {
    // console.log("Save button clicked");
    // console.log(formData);
    // Check if the function is called
    // Send POST request to save updated user data
    fetch(`https://billback.orbe.in/api/user/update/${authContext.user}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("User data updated successfully:", data);
        setUserData(formData); // Update user data in UI
        setEditable(false); // Disable edit mode
        localStorage.setItem("user", JSON.stringify(formData));
      })
      .catch((error) => {
        console.log("There was a problem with the fetch operation:", error);
      });
  };

  const auth = useContext(AuthContext);
  if (!auth.user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="profile">
      <Navbar />
      <div className="main-container-profile">
        {/* <h1>My Profile</h1> */}
        <div className="profile-details">
          <h4>FIRM NAME:</h4>
          <input
            type="text"
            autocomplete="one-time-code"
            name="shopname"
            value={formData.shopname || ""}
            onChange={handleInputChange}
            readOnly={!editable}
          />
          <h4>NAME OF OWNER:</h4>
          <input
            type="text"
            autocomplete="one-time-code"
            name="firstname"
            value={formData.firstname || ""}
            onChange={handleInputChange}
            readOnly={!editable}
          />
          <input
            type="text"
            autocomplete="one-time-code"
            name="lastname"
            value={formData.lastname || ""}
            onChange={handleInputChange}
            readOnly={!editable}
          />
          <h4>FIRM ADDRESS:</h4>
          <input
            type="text"
            autocomplete="one-time-code"
            name="shopaddress"
            value={formData.shopaddress || ""}
            onChange={handleInputChange}
            readOnly={!editable}
          />
          <h4>GST NUMBER:</h4>
          <input
            type="text"
            autocomplete="one-time-code"
            name="gstno"
            value={formData.gstno || ""}
            onChange={handleInputChange}
            readOnly={!editable}
          />
          <h4>EMAIL:</h4>
          <input
            type="text"
            autocomplete="one-time-code"
            name="email"
            value={userData.email || ""}
            readOnly
          />
          <h4>PHONE NO:</h4>
          <input
            type="text"
            autocomplete="one-time-code"
            name="phone"
            value={formData.phonenumber || ""}
            onChange={handleInputChange}
            readOnly={!editable}
          />
          <div className="button-group">
            {!editable && (
              <button className="edit-button" onClick={handleEditClick}>
                Edit
              </button>
            )}
            {editable && (
              <button className="save-button" onClick={handleSaveClick}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
