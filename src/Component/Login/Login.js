import React from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
	const [isFilled, setIsFilled] = React.useState(null);
	const [userExists, setUserExists] = React.useState(false);
	const navigate = useNavigate();

	const validateLogin = () => {
		const email = document.getElementById("login_email").value;
		const password = document.getElementById("login_password").value;

		if (email.length > 0) {
			if (password.length > 0) {
				setIsFilled(true);
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
			<input id="login_email" />
			<input id="login_password" />
			<button id="login_button" onClick={validateLogin}>
				Login
			</button>

			{isFilled === false && <p>Please enter a username and password</p>}
		</>
	);
};

export default Login;
