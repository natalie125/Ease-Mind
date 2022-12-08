import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from 'prop-types';

async function loginUser(credentials) {
	return fetch('http://127.0.0.1:5000/login', {
	  method: 'POST',
	//   mode:'no-cors',
	  headers: {
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify(credentials)
	})
	  .then(data => data.json())
   }

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
	  )

	  console.log(response);
	  return (response);
}


const Login = ({ setToken }) => {
	const [isFilled, setIsFilled] = React.useState(null);
	const [userExists, setUserExists] = React.useState(false);
	const navigate = useNavigate();

	// used to login user
	const validateLogin = async () => {
		const email = document.getElementById("login_email").value;
		const password = document.getElementById("login_password").value;

		if (email.length > 0) {
			if (password.length > 0) {
				// setIsFilled(true);
				//add code to check the database to see if user exists

				//call login function
				const token = await handleSubmit({
					email,
					password
				});

				// console.log(token['token']);
				// const output =  JSON.stringify(token['token']);
				// console.log(output);

				console.log(token)
				console.log(token.status)
				console.log(token.data.token)

				// setUserExists(true);
				if (token.data.token == 'test123'){
					console.log("User logged in")
					setUserExists(true);
					setToken(true);
					// navigate("/home");
				}

				// if (userExists){
				// 	console.log("User logged in")
				// 	setUserExists(true);
				// 	navigate("/home");
				// }
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


Login.propTypes = {
	setToken: PropTypes.func.isRequired
}

export default Login;
