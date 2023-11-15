import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Clear the session storage to remove the token that keeps us logged in.
    sessionStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

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
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
