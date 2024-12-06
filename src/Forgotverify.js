import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import ReactLoading from "react-loading";

function Verification() {
  //va confirmpassword = ""
  const [form, setForm] = useState({
    email: "",
  });

  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = () => {
    fetch("https://billback.orbe.in/api/otp/gen", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((result) => {
        alert(" OTP has been sent to E-mail.");
        navigate("/forgototpverify", { state: { email: form.email } });
        //navigate('/forgototpverify');
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const emailexist = () => {
    // Check if the email is empty
    setShowLoading(true);

    if (!form.email) {
      alert("Please enter your email.");
      return; // Stop further execution
    }
    // Check if the email is in a valid format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      setShowLoading(false);
      alert("Please enter a valid email address.");
      return; // Stop further execution
    }
    console.log("check1");
    fetch("https://billback.orbe.in/api/forgot/ver", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.exists) {
          // Email exists, call the sendOTP function
          sendOtp();
          setShowLoading(false);
        } else {
          setShowLoading(false);
          alert("Email does not exist.");
        }
      })
      .catch((err) => console.error(err));
    console.log("check2");
  };

  return (
    <>
      {showLoading && (
        <div className="loading-overlay">
          <ReactLoading type="spin" color="#000" height={50} width={50} />
        </div>
      )}
      <div
        className="parent-div"
        style={{ overflowX: "hidden", overflowY: "hidden" }}
      >
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
          <div
            className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center"
            style={{ height: "100%" }}
          >
            <div id="sign-up">
              <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
                <div>
                  <img
                    class="fit-picture"
                    src="logo1.png"
                    alt="Billing360 Logo"
                  />
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <h2>Forgot Password</h2>
                  <h2></h2>
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
                      value={form.email}
                      onChange={handleInputChange}
                    />
                    <br></br>
                    <br></br>
                  </div>
                  <div class="center">
                    <button type="submit" id="btn1" onClick={emailexist}>
                      Send OTP
                    </button>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
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
