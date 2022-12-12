import "../App.css";
import SignUp from "../Component/SignUp";
import { Link } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<p>Sign Up</p>
			</header>
			<body className="App-body">
				<SignUp />
			</body>
			<Link to="/">
				<button data-cy="signUpBackBttn"> Back </button>
			</Link>
		</div>
	);
}

export default App;
