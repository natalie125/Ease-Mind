import { useNavigate } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();

	const logout = () => {
		sessionStorage.clear();
		navigate("/login");
	};

	return (
		<div className="App-body">
			<header className="App-header">
				<nav class="navbar navbar-dark bg-dark" id="navbar">
					{/* <a class="navbar-brand" href="#"></a> */}
					<h1> LARKS APP</h1>
				</nav>
			</header>
			<div>
				<button data-cy="logoutBttn" id="logout_button" class="login-form__button" onClick={logout}>
					Logout
				</button>
			</div>
		</div>
	);
};

export default Header;
