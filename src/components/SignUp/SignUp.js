import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "../App/App.css";

const INVALIDDETAILS = 0;
const USEREXISTS = 1;
const SUCCESS = 2;
let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

axios.interceptors.response.use(undefined, (err) => {
	const error = err.response;
	return error;
});

const handleSubmit = async (email, password) => {
	var data = {
		email: email,
		password: password,
	};

	const response = await axios.post(BASEURL + "register", data, {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	});

	return response;
};

const SignUp = () => {
	const [isValid, setIsValid] = React.useState(null);

	const navigate = useNavigate();

	const validateSignup = async () => {
		const email = document.getElementById("signup_email").value;
		const password = document.getElementById("signup_password").value;

		//min 8 letter password, with at least a symbol, upper and lower case letters and a number
		var passwordRules = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

		if (email.length > 0 && password.length > 0) {
			console.log(email.length);
			if (email.includes("@")) {
				if (passwordRules.test(password)) {
					const response = await handleSubmit(email, password);
					if (response.status === 200) {
						setIsValid(SUCCESS);
					} else setIsValid(USEREXISTS);
					return;
				}
			}
		}
		setIsValid(INVALIDDETAILS);

		console.log("isValid");
	};

	React.useEffect(() => {
		if (isValid === SUCCESS) {
			navigate("/");
		}
	});

	return (
		<div className="App-unauthorised">
			<div className="authentication-background">
				<div className="App-body">

					<header className="authentication-header">
						<nav className="navbar navbar-dark bg-dark" id="navbar">
							{/* <a class="navbar-brand" href="#"></a> */}
							<h1 className="authentication-page-title"> LARKS APP</h1>
						</nav>
					</header>
					
					<div class="signup-form">
							<div>
								<h2 className="signup-title">Sign Up</h2>
								<p className="signup-subtitle">Create a new account below </p>
							</div>


							<label htmlFor="signup_email" className="form-labels">
								<input
									data-cy="signUpEmail"
									id="signup_email"
									class="authentication-form-input"
									type="text"
									placeholder="Email" />
							</label>

							<label for="signup_password" className="form-labels">
								<input
									data-cy="signUpPasswd"
									id="signup_password"
									class="authentication-form-input"
									type="password"
									placeholder="Password"
								></input>
							</label>

							<div>
								<button
									data-cy="signUpBttn"
									id="signup_button"
									class="authentication-button"
									onClick={validateSignup}>
									Sign Up
								</button>
							</div>

							{isValid === INVALIDDETAILS && (
								<p data-cy="signUpError" class="error-message">
									Please enter a valid email and password. Passwords need to have minimum 10
									characters, uppercase, lowercase and special character.
								</p>
							)}
							{isValid === USEREXISTS && (
								<p data-cy="signUpError" class="error-message">
									A user with this email already exixts.
								</p>
							)}

							<Link to="/login">
								<p class="login-link" data-cy="signUpBackBttn" id="login_button" >
									Already have an account? Log In
								</p>
							</Link>

							
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
