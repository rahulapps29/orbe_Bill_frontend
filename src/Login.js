import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import "./Register.css";
import ReactLoading from "react-loading";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showLoading, setShowLoading] = useState(false); //added
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const maxLength = 50; // Maximum allowed length
    const name = e.target.name;
    const value = e.target.value.slice(0, maxLength); // Truncate the input if it exceeds maxLength
    setForm({ ...form, [name]: value });
  };

  // const authCheck = () => {
  //   setTimeout(() => {
  //     fetch("https://billback.orbe.in/api/login/log/get")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         alert("Successfully Logged in");
  //         localStorage.setItem("user", JSON.stringify(data));
  //         authContext.signin(data._id, () => {
  //           navigate("/dashboard");
  //         });
  //       })
  //       .catch((err) => {
  //         alert("Wrong credentials, Try again")
  //         // console.log(err);
  //       });
  //       setShowLoading(false);  //added
  //   }, 3000);
  // };

  const loginUser = (e) => {
    // Cannot send empty data

    if (form.email === "" || form.password === "") {
      alert("Please enter all details to proceed...");
    } else {
      fetch("https://billback.orbe.in/api/login/log/in", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      })
        // .then((result) => {
        //   // console.log("User login", result);
        // })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              setShowLoading(false);
              alert("Wrong credentials, Try again");
              throw new Error("Wrong credentials");
            }

            setShowLoading(false);
            alert("Wrong credentials, Try again");
            throw new Error("Server error");
          }
          return response.json(); // Assuming server responds with JSON
        })
        .then((data) => {
          alert("Successfully Logged in");
          localStorage.setItem("user", JSON.stringify(data));
          authContext.signin(data._id, () => {
            navigate("/dashboard");
          });
          // Handle successful login here
          //console.log("User logged in successfully:", data);
          setShowLoading(false); // Set loading state to false
          // Do whatever you want with the user data
        })
        .catch((error) => {
          console.log("Something went wrong ", error);
        });
      setShowLoading(true);
      //authCheck();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {showLoading && ( // Conditionally render loading component
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
          <div id="sign-up">
            <img
              class="fit-picture"
              src="logo1.png"
              //alt="Your Company"
            />
            <h2 className="logintext">Login to your account</h2>

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
                  value={form.email}
                  onChange={handleInputChange}
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
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
              </div>

              <div id="center">
                <br></br>
                <button
                  type="submit"
                  id="btn1"
                  className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
                  onClick={loginUser}
                >
                  {/* <button
                type="submit"
                id="btn1"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={loginUser}
              > */}
                  Login
                </button>
              </div>
              <br></br>
              <div className="text-sm" class="center">
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  <Link to="/forgotverify"> Forgot your password?</Link>
                </span>
              </div>
              <p className="mt-2 text-center text-sm text-gray-600">
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  Don't Have an Account? Please{" "}
                  <Link to="/register"> Register now </Link>
                </span>
              </p>
            </form>
            <footer id="footer">
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
