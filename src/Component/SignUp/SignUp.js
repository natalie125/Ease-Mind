import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";


axios.interceptors.response.use(undefined, err => {
	const error = err.response;
	return error;
});



const handleSubmit = async (regAttempt) => {
	const response = await axios.post("http://127.0.0.1:5000/register",
	JSON.stringify({regAttempt}),
	{
		headers: {
			"Content-Type": "application/json",
		  'Access-Control-Allow-Origin' : true,
		},
	}
	).then ((response) => {
		return response;
	});
	return response;
}






const SignUp = ({ email, password }) => {
	const [isValid, setIsValid] = React.useState(null);
	const navigate = useNavigate();

	const validatesignup = async() => {
		const email = document.getElementById("signup_email").value;
		const password = document.getElementById("signup_password").value;

		//min 8 letter password, with at least a symbol, upper and lower case letters and a number
		var passwordRules = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

		if (email.includes("@")) {
			//add code to check if user exists already
			if (passwordRules.test(password)) {
				const response = await handleSubmit({email, password});
				if (response.status == 200){
					setIsValid(2);
				}
				else setIsValid(1);
				return;
			}
		}
		setIsValid(0);
	};

	React.useEffect(() => {
		if (isValid == 2) {
			navigate("/");
		}
	});

	return (
		<>
			<input data-cy="signUpEmail" id="signup_email" />
			<input data-cy="signUpPasswd" id="signup_password" />
			<button data-cy="signUpBttn" id="signup_button" onClick={validatesignup}>
				Sign Up
			</button>
			{isValid == 0 && <p data-cy="signUpError">Please enter a valid email or password. Passwords need to have minimum 10 characters, uppercase, lowercase and special character.</p>}
			{isValid == 1 && <p data-cy="signUpError">Email already exists.</p>}
		</>
	);
};

export default SignUp;
