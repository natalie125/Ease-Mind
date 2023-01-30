import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
		<div className="App">
			<div className="App-body">
				<h1>Please Sign Up</h1>
				<form>
					<label>
						<p>Email</p>
						<input id="signup_email" />
					</label>

					<label>
						<p>Password</p>
						<input id="signup_password" />
					</label>
			
					<div>
						<button id="signup_button" onClick={validatesignup}>Sign Up</button>
					</div>

					{/* <Link to="/">
						<button> Back </button>
					</Link> */}
				</form>
			</div>
		</div>
	
	);
};

export default SignUp;
