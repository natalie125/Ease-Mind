import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = (props) => {
	const navigate = useNavigate();

	const logout = () => {
		sessionStorage.clear(); // clear the session, including the token that keeps us logged in
		navigate("/", { replace: true }); // send us to the "/" URL
		window.location.reload(false); // refresh the page
	};

	return (
		<header className="App-header-primary">
			<h1 id="header_name"> LARKS APP</h1>
			<div id="header_buttons">
				{!props.hideHome && (
					<Link style={{ width: "100%" }} to="/home">
						<button className="header-button"> Home </button>
					</Link>
				)}
				<button data-cy="logoutBttn" id="logout_button" className="header-button" onClick={logout}>
					Logout
				</button>
			</div>
		</header>
	);
};

export default Header;
