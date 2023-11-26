import React, { useRef, useContext, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthTokenContext } from "../App";

let BASEURL = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV
    : process.env.REACT_APP_PROD;

function Login() {
  const {token, setToken} = useContext(AuthTokenContext);
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // TODO: Refactor these to be the inputs using states for value.
  // State to manage form fill status and error message
  const [isFilled, setIsFilled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (token) return <Navigate to="/home"/>;

  const handleSubmit = async () => {
    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";

    // Check for empty fields
    if (email.length === 0 || password.length === 0) {
      setIsFilled(false);
      setError("Please enter a username and password");
      return;
    }

    setIsFilled(true);
    try {
      // Attempt to perform a POST request to the login endpoint using Axios
      const response = await axios.post( BASEURL + "login", JSON.stringify({ credentials: { email, password } }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response);
      if (response.status === 200) {
        console.log("200 response");
        setToken(response.data.token);
        // TODO: If this is continued to be used then it should be added to
        //       a user context along with the auth token, setting session
        //       storage should ideally only be done in one place.
        sessionStorage.setItem("email", JSON.stringify(response.data.email));
        navigate("/home");
      } else {
        setIsFilled(false);
        setError("Your username or password is incorrect. Please try again.");
      }
    } catch (error) {
      setIsFilled(false);
      setError("Something went wrong. Please try again later.");
    }
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
              ref={emailRef}
              className="authentication-form-input"
              type="text"
              placeholder="Email"
              aria-label="Enter Email"
            />

            <input
              id="login_password"
              ref={passwordRef}
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
                {error || "Please enter a username and password"}
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
