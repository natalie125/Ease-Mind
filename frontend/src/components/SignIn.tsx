import React, {
  useEffect, useRef, useContext, useState,
} from 'react';
import axios, { AxiosError } from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthTokenContext } from '../App';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function SignIn() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { token, setToken } = useContext(AuthTokenContext);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isFilled, setIsFilled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (token) return <Navigate to="/home" />;

  const handleSubmit = async () => {
    if (!isOnline) {
      setIsFilled(false);
      setError('Network error. Please check your internet connection.');
      return;
    }

    const email = emailRef.current?.value ?? '';
    const password = passwordRef.current?.value ?? '';

    if (email.length === 0 || password.length === 0) {
      setIsFilled(false);
      setError('Please enter a username and password');
      return;
    }

    setIsFilled(true);
    try {
      const response = await axios.post(`${BASEURL}login`, JSON.stringify({ credentials: { email, password } }), {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });

      if (response.status === 200) {
        setToken(response.data.token);
        sessionStorage.setItem('email', JSON.stringify(response.data.email));
        navigate('/home');
      } else {
        setIsFilled(false);
        setError('Your username or password is incorrect. Please try again.');
      }
    } catch (err) {
      setIsFilled(false);
      const axiosError = err as AxiosError;

      if (axiosError.response && axiosError.response.status === 401) {
        setError('Incorrect email or password. Please try again.'); // Handle incorrect credentials
      } else if (axiosError.response) {
        setError('Server error. Please try again later.'); // Other server errors
      } else if (axiosError.request) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  // The Login form that is displayed to the user.
  return (
    <div className="authentication-container">
      <div className="authentication-background">

        {/* LOGIN HEADER */}
        <header className="authentication-header">
          <nav className="navbar navbar-dark bg-dark" id="navbar">
            <h1 className="authentication-page-title">LARKS APP</h1>
          </nav>
        </header>

        {/* LOGIN FORM */}
        <div className="authentication-form">
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
              data-cy="loginBtn"
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
              {error || 'Please enter a username and password'}
            </p>
          )}

          <div className="signup-link-container">
            <Link to="/auth/signup">
              <p className="signup-link" data-cy="loginSignUpBttn">
                Don&apos;t have an account?
                {' '}
                <b>Sign Up</b>
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
