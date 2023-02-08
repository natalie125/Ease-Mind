import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App/App.css";
import { useNavigate } from "react-router-dom";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);
// This fucntion is userd to login the user
const loginUser = async (credentials) => {
	// e.preventDefault();
	const response = await axios
		.post(BASEURL + "login", JSON.stringify({ credentials }), {
			headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": '*'},
			//   withCredentials: true,
		})
		.then((response) => {
			console.log(response);
			console.log(response.status);

			if (response) {
				console.log("User logged in");
				console.log(response);
				sessionStorage.setItem("token", JSON.stringify(response.data.token));
			}
			return response;
		});
	console.log(response);
	return response;
};

// The login Form
function Login({ setToken }) {
	const [isFilled, setIsFilled] = React.useState(null);
	const [isValid, setIsValid] = React.useState(null);

	// to navigate the user to the home page
	const navigate = useNavigate();

	// This function to calls the login function which returns after a login request
	const handleSubmit = async (e) => {
		const email = document.getElementById("login_email").value;
		const password = document.getElementById("login_password").value;

		if (email.length > 0 && password.length > 0) {
			setIsFilled(true);

			const token = await loginUser({
				email,
				password,
			});

			token.data.token === undefined ? setIsValid(false) : setIsValid(true);

			console.log("AAAAAAAAAA");
			console.log(token.data.token);
			console.log(isValid);

			// Set the token of the application
			console.log("Setting Token");
			setToken(token);

			// Go to home page after successful login
			navigate("/home", { replace: true });

			return;
		}

		setIsFilled(false);
	};

	// This is rendered to the user
	// The Login form that is displayed to the user
	return (
		<div className="App-unauthorised">
			<div className="App-body">
				<header className="App-header">
					<nav className="navbar navbar-dark bg-dark" id="navbar">
						{/* <a class="navbar-brand" href="#"></a> */}
						<h1>LARKS APP</h1>
					</nav>
				</header>
				<div class="login-form">
					<div class="login-form__content">
						<div class="login-form__header">Log into an existing account below:</div>
							<label for="login_email" className="form-labels">Enter Email:
								<input data-cy="loginEmail" id="login_email" class="login-form__input" type="text" placeholder="Email" />
							</label>
							
							
							<label for="login_password" className="form-labels"> Enter Password:</label>
								<input
									id="login_password"
									class="login-form__input"
									type="password"
									placeholder="Password"
									data-cy="loginPassword"
								/>
							
							

						<div>
							<button
								class="login-form__button"
								data-cy="loginBttn"
								type="submit"
								onClick={async () => {
									await handleSubmit();
								}}
							>
								Login
							</button>
						</div>

						<Link to="/signup">
							<button class="login-form__button" data-cy="signUpBttn"> Sign Up </button>
						</Link>

						{isFilled === false && (
							<p data-cy="loginError" class="error-message">
								Please enter a username and password
							</p>
						)}

						{isValid === false && (
							<p data-cy="loginError" class="error-message">
								Your username or password is incorrect. Please try again.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// const Login = ({ setToken }) => {
// 	const [isFilled, setIsFilled] = React.useState(null);
// 	const [userExists, setUserExists] = React.useState(false);
// 	const navigate = useNavigate();

// 	// const token = sessionStorage.getItem('token');
// 	// if(token){
// 	// 	navigate("/home");
// 	// }

// 	// used to login user
// 	const validateLogin = async () => {
// 		const email = document.getElementById("login_email").value;
// 		const password = document.getElementById("login_password").value;

// 		if (email.length > 0) {
// 			if (password.length > 0) {
// 				setIsFilled(true)
// 				console.log(isFilled)
// 				//add code to check the database to see if user exists
// 				//call login function
// 				const response = await handleSubmit({email,password})
// 				console.log("Got a response")
// 				console.log(response)
// 				setUserExists(true)
// 				// navigate("/home");

// 			}
// 		}
// 		setIsFilled(false);
// 	};

// 	// React.useEffect(() => {
// 	// 	if (isFilled) {
// 	// 		navigate("/home");
// 	// 	}
// 	// });

// 	React.useEffect(() => {
// 		if (userExists) {
// 			return (
// 				<div className="App">
// 					<Main />
// 				</div>
// 			);
// 			// navigate("/home");
// 		}
// 	});

// 	return (
// 		<>
// 			<input id="login_email" />
// 			<input id="login_password" />
// 			<button id="login_button" onClick={validateLogin}>
// 				Login
// 			</button>

// 			{isFilled === false && <p>Please enter a username and password</p>}

// 		</>

// 	);
// };

// Login.propTypes = {
// 	setToken: PropTypes.func.isRequired
// }

export default Login;
