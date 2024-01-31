import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthTokenContext } from '../App';

const INVALIDDETAILS = 0;
const USEREXISTS = 1;
const FRONTENDERROR = 2;

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function SignUp() {
  const { token, setToken } = useContext(AuthTokenContext);
  const [isError, setIsError] = React.useState<null | number>(null);
  const [networkError, setNetworkError] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BASEURL}register`, {
        email: email.trim(),
        password: password.trim(),
      });
      return response;
    } catch (error) {
      return null;
    }
  };
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const validateSignup = async () => {
    if (!navigator.onLine) {
      setNetworkError(true);
      setIsError(null); // Reset error state when network error occurs
      return;
    }

    const passwordRules = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    setIsError(null); // Reset error state when attempting signup

    if (email.length > 0 && password.length > 0) {
      if (email.includes('@') && passwordRules.test(password)) {
        const response = await handleSubmit();

        if (response === null) {
          setIsError(FRONTENDERROR);
        } else if (response.status === 200) {
          setToken(response.data.token);
          setIsError(null); // Reset error state on successful signup
          navigate('/home');
        } else if (response.status === 409) {
          setIsError(USEREXISTS);
        } else {
          setIsError(INVALIDDETAILS);
        }
        return;
      }
    }
    setIsError(INVALIDDETAILS);
  };

  if (token) return <Navigate to="/home" />;

  return (
    <div className="authentication-container">
      <div className="authentication-background">
        <header className="authentication-header">
          <nav className="navbar navbar-dark bg-dark" id="navbar">
            <h1 className="authentication-page-title"> LARKS APP</h1>
          </nav>
        </header>

        <div className="authentication-form">
          <div>
            <h2 className="signup-title">Sign Up</h2>
            <p className="signup-subtitle">Create a new account below </p>
          </div>
          <div className="password-field-container">
            <input
              data-cy="signUpEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="authentication-form-input"
              type="text"
              placeholder="Email"
              aria-label="Enter Email"
            />

            <div className="password-field-container">
              <input
                data-cy="signUpPasswd"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="authentication-form-input"
                type={passwordShown ? 'text' : 'password'}
                placeholder="Password"
                aria-label="Enter Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-button"
              >
                {passwordShown ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              data-cy="signUpBttn"
              id="signup_button"
              className="authentication-button"
              onClick={validateSignup}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {isError === INVALIDDETAILS && !networkError && (
            <p data-cy="signUpError" className="error-message">
              Please enter a valid email and password. Passwords need to have a minimum of 10
              characters, including uppercase, lowercase, and a special character.
            </p>
          )}
          {isError === USEREXISTS && !networkError && (
            <p data-cy="signUpError" className="error-message">
              A user with this email already exists.
            </p>
          )}
          {networkError && (
            <p className="error-message">Network error. Please check your internet connection.</p>
          )}

          <div className="signup-link-container">
            <Link to="/auth/signin">
              <p className="login-link" data-cy="signUpLoginBtn" id="login_button">
                {' '}
                Already have an account?
                {' '}
                <b>Log In</b>
                {' '}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
