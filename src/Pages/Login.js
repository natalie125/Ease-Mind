import "../App.css";
import { Link } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<p>Login</p>
			</header>
			<body className="App-body">
				<input />
				<input />
				<Link to="/home">
					<button>Login</button>
				</Link>
			</body>
		</div>
	);
}

export default App;
