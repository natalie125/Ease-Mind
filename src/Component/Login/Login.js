import React, { useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from 'prop-types';
import App from "../../App";
import Main from "../../Main";

const handleSubmit = async (credentials) => {
	// e.preventDefault();
	  const response = await axios.post("http://127.0.0.1:5000/login",
		JSON.stringify({ credentials}),
		{
		  headers: { "Content-Type": "application/json",
		  'Access-Control-Allow-Origin' : true,
		 },
		//   withCredentials: true,
		}
	  ).then((response) => {
		console.log(response)
		console.log(response.status)
		if (response){
			console.log("User logged in")
			console.log(response)
			sessionStorage.setItem('token', JSON.stringify(response.data.token));
		}
		return response;
	})
	  console.log(response);
	  return response;
}


const Login = ({ setToken }) => {
	const [isFilled, setIsFilled] = React.useState(null);
	const [userExists, setUserExists] = React.useState(false);
	const navigate = useNavigate();

	// const token = sessionStorage.getItem('token');
	// if(token){
	// 	navigate("/home");
	// }

	// used to login user
	const validateLogin = async () => {
		const email = document.getElementById("login_email").value;
		const password = document.getElementById("login_password").value;

		if (email.length > 0) {
			if (password.length > 0) {
				setIsFilled(true)
				console.log(isFilled)
				//add code to check the database to see if user exists
				//call login function
				const response = await handleSubmit({email,password})
				console.log("Got a response")
				console.log(response)
				setUserExists(true)
				// navigate("/home");

			}
		}
		setIsFilled(false);
	};

	// React.useEffect(() => {
	// 	if (isFilled) {
	// 		navigate("/home");
	// 	}
	// });

	React.useEffect(() => {
		if (userExists) {
			return (
				<div className="App">
					<Main />
				</div>
			);
			// navigate("/home");
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


Login.propTypes = {
	setToken: PropTypes.func.isRequired
}

export default Login;
