import React from "react";
import Main from "./Main";
import "./App.css";
import Login from './Component/Login';




export default function App() {
	//get user's token from session
	const token = sessionStorage.getItem('token');

	// if there is no token render the login page again
	if(!token) {
		// return(<Login />)
		return (
			<div className="App">
				<Login />
			</div>
		);
	}

	return (
		<div className="App">
			<Main />
		</div>
	);
}
