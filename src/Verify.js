import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./verify.css";
import ReactLoading from "react-loading";

function Verification() {
  //va confirmpassword = ""
  const [form, setForm] = useState({
    email: "",
  });
  const [showLoading, setShowLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = (req, res) => {
    // Check if the email is empty
    if (!form.email) {
      alert("Please enter your email.");
      return; // Stop further execution
    }

    // Check if the email is in a valid format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return; // Stop further execution
    }
    fetch("https://billback.orbe.in/api/otp/gen?source=login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((result) => {
        alert(" OTP has been sent to E-mail.");
        //res.redirect('/otp?source=login');
        navigate("/otp", { state: { email: form.email } });
      })
      .catch((err) => console.log(err));
  };

  const emailexist = () => {
    // Check if the email is empty
    setShowLoading(true);
    if (!form.email) {
      setShowLoading(false);
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
          setShowLoading(false);
          alert("Account already exists with this Email.");
        } else {
          //alert("");
          setShowLoading(false);
          sendOtp();
        }
      })
      .catch((err) => console.error(err));
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
                    className="fit-picture"
                    src="logo1.png"
                    alt="Billing360 Logo"
                  />
                  <br></br>
                  <br></br>
                  <br></br>
                  <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Register
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
                      value={form.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <br />
                  <div className="center">
                    <button type="submit" id="btn1" onClick={emailexist}>
                      Send OTP
                    </button>
                    <br />
                    <p
                      className="mt-2 text-center text-sm text-gray-600"
                      id="rememberme"
                    >
                      Or{" "}
                      <span className="font-medium text-indigo-600 hover:text-indigo-500">
                        already Have an Account? <br />
                        <Link to="/">Sign in</Link>
                      </span>
                    </p>
                  </div>
                </form>
              </div>
              <footer id="footerverify">
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
