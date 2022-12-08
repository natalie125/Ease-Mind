import "../App.css";
import Login from "../Component/Login";
import { Link } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<p>Login</p>
			</header>
			<body className="App-body">
				<Login />
				<Link to="/signup">
					<button data-cy="signUpBttn"> Sign Up </button>
				</Link>
			</body>
		</div>
	);
}

export default App;
