import React from "react";
import { useNavigate } from "react-router-dom";

const SignUp = ({ email, password }) => {
	const [isValid, setIsValid] = React.useState(null);
	const navigate = useNavigate();

	const validatesignup = () => {
		const email = document.getElementById("signup_email").value;
		const password = document.getElementById("signup_password").value;

		//min 8 letter password, with at least a symbol, upper and lower case letters and a number
		var passwordRules = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

		if (email.includes("@")) {
			//add code to check if user exists already
			if (passwordRules.test(password)) {
				setIsValid(true);
				return;
			}
		}

		setIsValid(false);
	};

	React.useEffect(() => {
		if (isValid) {
			navigate("/home");
		}
	});

	return (
		<>
			<input data-cy="signUpEmail" id="signup_email" />
			<input data-cy="signUpPasswd" id="signup_password" />
			<button data-cy="signUpBttn" id="signup_button" onClick={validatesignup}>
				Sign Up
			</button>
			{isValid === false && <p data-cy="signUpError">Please enter a valid username or password</p>}
		</>
	);
};

export default SignUp;
