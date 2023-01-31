import React from "react";
import Main from "../../Main";
import "../App/App.css";
import Login from '../Login/Login';
import useToken from '../App/useToken';

function App() {
	const { token, setToken } = useToken();

	if(!token) {
		return <Login setToken={setToken} />
	}

	return (
		<div className="App">
			<Main />
		</div>
	);
}

export default App;