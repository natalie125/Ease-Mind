import { useNavigate } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();

	const logout = () => {
		sessionStorage.clear();
		navigate("/login");
	};

	return (
		<header className="App-header-secondary">
			<h1 id="header_name"> LARKS APP</h1>
			<div id="header_buttons">
				<button data-cy="logoutBttn" id="logout_button" class="login-form__button" onClick={logout}>
					Logout
				</button>
			</div>
		</header>
	);
};

export default Header;
