import ReactLoading from "react-loading";
import React, { useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
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
  const phonePattern = /^\d{10}$/;
  const [agreeTerms, setAgreeTerms] = useState(false); // State to track if terms are agreed
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const location = useLocation();
  const { email } = location.state || {}; // Destructure email from location state

  const handleInputChange = (e) => {
    const maxLength = 50; // Maximum allowed length
    const name = e.target.name;
    const value = e.target.value.slice(0, maxLength); // Truncate the input if it exceeds maxLength
    setForm({ ...form, [name]: value });
  };

  const registerUser = () => {
    // Check if passwords match
    form.email = email;
    if (form.password !== form.confirmpassword) {
      setShowLoading(false);
      alert("Password and Confirm Password do not match");
      return; // Exit function if passwords don't match
    }
    if (!phonePattern.test(form.phonenumber)) {
      setShowLoading(false);
      alert("Please enter a valid phone number");
      return;
    }
    if (!form.email.includes("@")) {
      setShowLoading(false);
      alert("Invalid Email, doesn't include @");
      return; // Exit function if email is invalid
    }
    if (form.password.length < 6) {
      setShowLoading(false);
      alert("Password should be at least 6 characters");
      return; // Exit function if password is too short
    }
    fetch("https://billback.orbe.in/api/register/reg", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((result) => {
        setShowLoading(false);
        alert("Successfully Registered, Now Login with your details");
        navigate("/");
      })
      .catch((err) => {
        setShowLoading(false);
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    setShowLoading(true);
    e.preventDefault();
    setForm({ ...form, email: email || "" });
    // Check if terms are agreed
    if (!agreeTerms) {
      setShowLoading(false);
      alert("Please agree to the Terms & Conditions to proceed.");
      return;
    }

    registerUser();
  };
  if (!(location.state && location.state.email)) {
    return <Navigate to="/verify" replace />;
  }
  return (
    <>
      {showLoading && ( // Conditionally render loading component
        <div className="loading-overlay">
          <ReactLoading type="spin" color="#000" height={50} width={50} />
        </div>
      )}
      <div className="reg">
        <div id="sign-up">
          <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
            <div>
              <img
                className="fit-picture"
                src="logo1.png"
                alt="Billing360 Logo"
              />
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Fill Details
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex gap-4">
                <input
                  name="firstname"
                  type="text"
                  required
                  className="input-box"
                  placeholder="First Name"
                  value={form.firstname}
                  onChange={handleInputChange}
                />

                <input
                  name="lastname"
                  type="text"
                  required
                  className="input-box"
                  placeholder="Last Name"
                  value={form.lastname}
                  onChange={handleInputChange}
                />
              </div>
              <br></br>
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-box"
                  placeholder="Email address"
                  value={email || ""} // Set value to email received from location state
                  disabled // Disable input to prevent user modification
                />
                <input
                  name="phonenumber"
                  type="text"
                  autoComplete="off"
                  required
                  className="input-box"
                  placeholder="Phone Number"
                  value={form.phonenumber}
                  onChange={handleInputChange}
                />
                <br></br>
                <br></br>
                <input
                  name="shopname"
                  type="text"
                  required
                  className="input-box"
                  placeholder="Shop Name"
                  value={form.shopname}
                  onChange={handleInputChange}
                />
                <input
                  name="shopaddress"
                  type="text"
                  required
                  className="input-box"
                  placeholder="Shop Address"
                  value={form.shopaddress}
                  onChange={handleInputChange}
                />

                <br></br>
                <br></br>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="off"
                  required
                  className="input-box"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  autoComplete="off"
                  required
                  className="input-box"
                  placeholder="Confirm Password"
                  value={form.confirmpassword}
                  onChange={handleInputChange}
                />
                <br></br>
                <br></br>
                <input
                  name="gstno"
                  type="text"
                  autoComplete="off"
                  required
                  className="input-box"
                  placeholder="Enter GST No."
                  value={form.gstno}
                  onChange={handleInputChange}
                />
              </div>
              <br></br>
              <div className="flex items-center justify-between" class="center">
                <div className="flex items-center" id="rememberme">
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    I Agree to the Terms & Conditons
                  </label>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    required
                  ></input>
                </div>
              </div>
              <br></br>
              <div class="center">
                <button type="submit" id="btn1">
                  Sign up
                </button>
                <br></br>
                <p
                  className="mt-2 text-center text-sm text-gray-600"
                  id="rememberme"
                >
                  Or{" "}
                  <span className="font-medium text-indigo-600 hover:text-indigo-500">
                    Already Have an Account? <Link to="/">Sign in</Link>
                  </span>
                </p>
              </div>
            </form>
          </div>
          <footer id="footer">
            <span>Billing 360 &copy; 2024 Copyright All Rights Reserved.</span>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Register;
