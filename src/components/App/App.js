import React from "react";
import Main from "../../Main";
import "../App/App.css";
import Login from '../Login/Login';
import useToken from '../App/useToken';
import { useLocation } from 'react-router-dom'

// This function Returns the current page the user is on
function GetCurrentPage() {
	const location = useLocation();
	console.log(location.pathname);
	return location.pathname
}

function App() {
	const { token, setToken } = useToken();
	/*
	// If a user does not have an authentication token, a login page is displayed to them
	if(!token) {
		const location = GetCurrentPage();
		console.log(location)

		// Don't show the login form on the sign up page
		if(location !== "/signup" ){
			return <Login setToken={setToken} />
		}
	}
	*/
	return (
		<div className="App">
			<Main />
		</div>
	);
}

export default App;