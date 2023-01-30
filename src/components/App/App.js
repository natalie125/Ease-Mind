import React from "react";
import Main from "../../Main";
import "../App/App.css";
import Login from '../Login/Login';
import useToken from '../App/useToken';

export default function App() {
	const { token, setToken } = useToken();

	if(!token) {
		console.log("Here")
		return <Login setToken={setToken} />
		console.log("Here")
	}

	console.log("Here2")

	return (
		<div className="App">
			<Main />
		</div>
	);
}
