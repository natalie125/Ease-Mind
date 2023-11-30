import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthTokenContext } from "../../App";
import "./Header.scss";

const Header = () => {
  const location = useLocation();
  useEffect(()=>{}, [location]);

  const {token, setToken} = useContext(AuthTokenContext);
  if (!token) return null;

  return (
    <header className="header">
      <h1>LARKS APP</h1>
      <div>
        {window.location.pathname !== "/home" && (
          <Link style={{ width: "100%" }} to="/home">
            <button>Home</button>
          </Link>
        )}
        <button data-cy="logoutBtn" onClick={() => setToken(null)}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
