import React from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
	const [isFilled, setIsFilled] = React.useState(null);
	const [userExists, setUserExists] = React.useState(true);
	const navigate = useNavigate();

	const validateLogin = () => {
		const email = document.getElementById("login_email").value;
		const password = document.getElementById("login_password").value;

		if (email.length > 0) {
			if (password.length > 0) {
				setIsFilled(true);
				console.log(isFilled);
				return;
				//add code to check the database to see if user exists
			}
		}
		setIsFilled(false);
	};

	React.useEffect(() => {
		if (isFilled) {
			navigate("/home");
		}
	});

	return (
		<>
			<input id="login_email" data-cy="loginEmail" />
			<input id="login_password" data-cy="loginPasswd" />
			<button id="login_button" onClick={validateLogin} data-cy="loginBttn">
				Login
			</button>

			{isFilled === false && <p data-cy="loginError">Please enter a username and password</p>}
			{isFilled === true && userExists === false && (
				<p data-cy="loginError">Your username or password is incorrect</p>
			)}
		</>
	);
};

export default Login;
