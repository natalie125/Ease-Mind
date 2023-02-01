import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../App/App.css";


axios.interceptors.response.use(undefined, (err) => {
	const error = err.response;
	return error;
});

const handleSubmit = async (email, password) => {
	var data = {
		email: email,
		password: password,
	};

	const response = await axios.post("http://127.0.0.1:5000/register", data, {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": true,
		},
	});

	return response;
};

const SignUp = ({ email, password }) => {
	const [isValid, setIsValid] = React.useState(null);
	const navigate = useNavigate();

	const validatesignup = async () => {
		const email = document.getElementById("signup_email").value;
		const password = document.getElementById("signup_password").value;

		//min 8 letter password, with at least a symbol, upper and lower case letters and a number
		var passwordRules = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

		if (email.includes("@")) {
			//add code to check if user exists already
			if (passwordRules.test(password)) {
				const response = await handleSubmit(email, password);
				if (response.status === 200) {
					setIsValid(2);
				} else setIsValid(1);
				return;
			}
		}
		setIsValid(0);
	};

	React.useEffect(() => {
		if (isValid === 2) {
			navigate("/");
		}
	});

	return (
		<div className="App">
			<div className="App-body">
			<header className="App-header">
				<nav class="navbar navbar-dark bg-dark" id = 'navbar'>
					{/* <a class="navbar-brand" href="#"></a> */}
					<h1> LARKS APP</h1>
				</nav>
			</header>
			<div class ="login-form"> 
			<form class="login-form">
				<div class="login-form__content">
                    <div class="login-form__header">Create a new account below:</div>

					<label>
						<input data-cy="signUpEmail" class="login-form__input" type="text" name="dc_email" placeholder="Email"></input>
					</label>

					<label>
						<input data-cy="signUpPasswd" class="login-form__input" type="password" name="dc_password" placeholder="Password"></input>
					</label>
					
					<div>
						<button data-cy="signUpBttn" id="signup_button" class="login-form__button" onClick={validatesignup}>
						Sign Up
						</button>
					</div>

				{isValid === 0 && (
					<p data-cy="signUpError">
						Please enter a valid email or password. Passwords need to have minimum 10 characters,
						uppercase, lowercase and special character.
					</p>
				)}
				{isValid === 1 && <p data-cy="signUpError">Email already exists.</p>}

				</div>
				</form>
			</div>
			</div>
		</div>
	);
};

export default SignUp;
