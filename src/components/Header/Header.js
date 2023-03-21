import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();

	const logout = () => {
		sessionStorage.clear();	// clear the session, including the token that keeps us logged in
		navigate("/", { replace: true }); // send us to the "/" URL
		window.location.reload(false);	// refresh the page
	};

	return (
		<header className="App-header-primary">
				<Link id="header_name" to="/">
					<h1> LARKS APP</h1>
				</Link>

				<div id="header_buttons">
					<button data-cy="logoutBttn" id="logout_button" className="logout-button" onClick={logout}>
						Logout
					</button>
				</div>
		</header>
	);
};

export default Header;
