import SignUp from "../components/SignUp";
import { Link } from "react-router-dom";

import "../components/App/App.css";

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
				<button> Back </button>
			</Link>
		</div>
	);
}

export default App;
