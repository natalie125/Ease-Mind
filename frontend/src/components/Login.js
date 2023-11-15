import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

let BASEURL = "";
process.env.NODE_ENV === "development"
  ? (BASEURL = process.env.REACT_APP_DEV)
  : (BASEURL = process.env.REACT_APP_PROD);

const loginUser = async (credentials) => {
  const response = await axios
    .post(BASEURL + "login", JSON.stringify({ credentials }), {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      console.log(response);
      console.log(response.status);

      if (response) {
        console.log("User logged in");
        console.log(response);
        sessionStorage.setItem("token", JSON.stringify(response.data.token));
        sessionStorage.setItem("email", JSON.stringify(response.data.email)); // added by Alex to track email of logged in user
      }
      return response;
    });
  console.log(response);
  return response;
};

function Login({ setToken }) {
  const navigate = useNavigate();

  const [isFilled, setIsFilled] = React.useState(null);
  const [isValid, setIsValid] = React.useState(null);

  const handleSubmit = async (e) => {
    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    if (email.length > 0 && password.length > 0) {
      setIsFilled(true);
      const token = await loginUser({ email, password });
      token.data.token === undefined ? setIsValid(false) : setIsValid(true);

      // Set the users auth token.
      setToken(token);

      // Go to home page after successful login.
      navigate("/home", { replace: true });

      return;
    }

    setIsFilled(false);
  };

  // The Login form that is displayed to the user.
  return (
    <div className="authentication-container">
      <div className="authentication-background">
        <div className="App-body">

          {/* LOGIN HEADER */}
          <header className="authentication-header">
            <nav className="navbar navbar-dark bg-dark" id="navbar">
              <h1 className="authentication-page-title">LARKS APP</h1>
            </nav>
          </header>

          {/* LOGIN FORM */}
          <div className="login-form">
            <div>
              <h2 className="login-title">Login</h2>
              <p className="login-subtitle">Please login to your account below </p>
            </div>

            <input
              data-cy="loginEmail"
              id="login_email"
              className="authentication-form-input"
              type="text"
              placeholder="Email"
              aria-label="Enter Password"
            />

            <input
              id="login_password"
              className="authentication-form-input"
              type="password"
              placeholder="Password"
              data-cy="loginPassword"
              aria-label="Enter Password"
            />

            <div>
              <button
                className="authentication-button"
                data-cy="loginBttn"
                type="submit"
                onClick={async () => {
                  await handleSubmit();
                }}
              >
                Login
              </button>
            </div>

            {isFilled === false && (
              <p data-cy="loginError" className="error-message">
                Please enter a username and password
              </p>
            )}

            {isValid === false && (
              <p data-cy="loginError" className="error-message">
                Your username or password is incorrect. Please try again.
              </p>
            )}

            <div className="signup-link-container">
              <Link to="/signup">
                <p className="sigup-link" data-cy="loginSignUpBttn">
                  Don't have an account? <b>Sign Up</b>
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
