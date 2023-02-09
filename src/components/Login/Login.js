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
		<div className="authentication-container">
			<div className="authentication-background">
				<div className="App-body">
					{/* LOGIN HEADER */}
					<header className="authentication-header">
						<nav className="navbar navbar-dark bg-dark" id="navbar">
							{/* <a className="navbar-brand" href="#"></a> */}
							<h1 className="authentication-page-title">LARKS APP</h1>
						</nav>
					</header>
					
					{/* LOGIN FORM */}
					<div className="login-form">
						<div>
							<h2 className="login-title">Login</h2>
							<p className="login-subtitle">Please login to your account below </p>
						</div>
							
						<label htmlFor="login_email" className="form-labels">
							<input 
							data-cy="loginEmail" 
							id="login_email" className="authentication-form-input" 
							type="text" 
							placeholder="Email" />
						</label>
								
						<label htmlFor="login_password" className="form-labels"></label>
						<input
							id="login_password"
							className="authentication-form-input"
							type="password"
							placeholder="Password"
							data-cy="loginPassword"
						/>
						<div>
							<button
								className="authentication-button"
								data-cy="loginBttn"
								type="submit"
								onClick={async () => {
									await handleSubmit();
								}}
							>
								Login
							</button>
						</div>

						

						{isFilled === false && (
							<p data-cy="loginError" className="error-message">
								Please enter a username and password
							</p>
						)}

						{isValid === false && (
							<p data-cy="loginError" className="error-message">
								Your username or password is incorrect. Please try again.
							</p>
						)}

						<div className="signup-link-container"> 
							<Link to="/signup">
								<p className="sigup-link" data-cy="signUpBttn"> Don't have an account? <b>Sign Up</b>  </p>
							</Link>
						</div>
						
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
