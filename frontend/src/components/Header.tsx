import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthTokenContext } from "../App";

const Header = () => {
  const location = useLocation();
  useEffect(()=>{}, [location]);

  const {token, setToken} = useContext(AuthTokenContext);
  if (!token) return null;

  return (
    <header className="App-header-primary">
      <h1 id="header_name"> LARKS APP</h1>
      <div id="header_buttons">
        {window.location.pathname !== "/home" && (
          <Link style={{ width: "100%" }} to="/home">
            <button className="header-button"> Home </button>
          </Link>
        )}
        <button
          data-cy="logoutBttn"
          id="logout_button"
          className="header-button"
          onClick={() => setToken(null)}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
