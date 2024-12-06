import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Register.css";
import ReactLoading from "react-loading";

function Verification() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
  });

  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // using this to get Email with which the user verified
  const location = useLocation();
  const { email } = location.state || {}; // Destructure email from location state
  form.email = email;

  const verifyOtp = (req, res) => {
    //const source = req.query.source;
    setShowLoading(true);
    fetch("https://billback.orbe.in/api/otp/ver", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        //   if (source === 'login') {
        //     // res.redirect('/register'); // Redirect to register page after login page
        //     if (response.ok) {
        //       // If OTP verification is successful, navigate to register page
        //       navigate('/register', { state: { email: form.email } });
        //     } else {
        //       // If OTP verification fails, display error message or handle accordingly
        //       alert("OTP verification failed.");
        //     }
        // } else if (source === 'forgot') {
        //     res.redirect('/forgot'); // Redirect to login page after forgot page
        // } else {
        //     // Handle other cases or redirect to a default page
        //     res.redirect('/default');
        // }
        if (response.ok) {
          // If OTP verification is successful, navigate to register page
          setShowLoading(false);
          navigate("/forgotpass", { state: { email: form.email } });
        } else {
          // If OTP verification fails, display error message or handle accordingly
          setShowLoading(false);
          alert("OTP verification failed.");
        }
      })
      .catch((err) => {
        setShowLoading(false);
        console.error("Error during OTP verification:", err);
        // Handle the error and display an error message
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {showLoading && (
        <div className="loading-overlay">
          <ReactLoading type="spin" color="#000" height={50} width={50} />
        </div>
      )}
      <div className="parent-div">
        <div className="left-div">
          <div className="image-container">
            <img
              className="fit-pictureverify2"
              src="Billing_2.jpeg"
              alt="Billing360 Logo"
            />
          </div>
        </div>
        <div className="right-div">
          <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
            <div id="sign-up">
              <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
                <div>
                  <img
                    className="fit-picture"
                    src="logo1.png"
                    alt="Billing360 Logo"
                  />
                  <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Verify OTP
                  </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="input-box"
                      placeholder="Email address"
                      //value={form.email}
                      value={email || ""} // Set value to email received from location state
                      disabled // Disable input to prevent user modification
                      //onChange={handleInputChange}
                    />
                    <br />
                    <br />
                    <input
                      id="otp-input"
                      name="otp"
                      type="text"
                      autoComplete="off"
                      required
                      className="input-box"
                      placeholder="Enter 6-digit OTP"
                      value={form.otp}
                      onChange={handleInputChange}
                      pattern="[0-9]{6}"
                    />
                    <br />
                    <br />
                  </div>
                  <br />
                  <br />
                  <div className="center">
                    <button type="submit" id="btn1" onClick={verifyOtp}>
                      VERIFY OTP
                    </button>
                    <br />
                    <br />
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
                <span>
                  Billing 360 &copy; 2024 Copyright All Rights Reserved.
                </span>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Verification;
