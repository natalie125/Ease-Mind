import Login from "../components/Login";
import { Link } from "react-router-dom";

import "../components/App/App.css";

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
