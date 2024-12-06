// import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import AuthContext from "./AuthContext";
import "./Register.css";
import ReactLoading from "react-loading";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);

  const handleInputChange = (e) => {
    const maxLength = 25; // Maximum allowed length
    const name = e.target.name;
    const value = e.target.value.slice(0, maxLength); // Truncate the input if it exceeds maxLength
    setForm({ ...form, [name]: value });
  };

  const location = useLocation();
  const { email } = location.state || {}; // Destructure email from location state
  form.email = email;

  const forgotpass = (e) => {
    // Cannot send empty data
    //form.email = email;
    setShowLoading(true);
    if (form.email === "" || form.password === "") {
      setShowLoading(false);
      alert("To change password, enter details to proceed...");
    } else if (form.password.length < 6) {
      setShowLoading(false);
      alert("Password should be at least 6 characters");
      return; // Exit function if password is too short
    } else {
      // console.log(form.password)
      // console.log(form.email)
      fetch("https://billback.orbe.in/api/forgot/for", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then((result) => {
          setShowLoading(false);
          alert("Successfully changed password");
          // console.log("Successfully changed password", result);
          navigate("/");
        })
        .catch((error) => {
          setShowLoading(false);
          // console.log("Something went wrong ", error);
        });
    }
    //authCheck();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  if (!(location.state && location.state.email)) {
    return <Navigate to="/forgotverify" replace />;
  }

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
          <div id="sign-up">
            <div>
              <img
                class="fit-picture"
                src="logo1.png"
                //alt="Your Company"
              />
              <h2>
                <br></br>
                <br></br>
                Change your Password
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {/* <input type="hidden" name="remember" defaultValue="true" /> */}
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
              </div>
              <br></br>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input-box"
                  placeholder="New Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
              </div>

              <div id="center">
                <br></br>
                <button
                  type="submit"
                  id="btn1"
                  className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={forgotpass}
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    {/* <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  /> */}
                  </span>
                  Change Password
                </button>
              </div>
            </form>
            <footer id="footerverify">
              <span>
                Billing 360 &copy; 2024 Copyright All Rights Reserved.
              </span>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
