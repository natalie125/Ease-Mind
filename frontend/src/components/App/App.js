import React, { useState, useEffect } from "react";
import Routes from "../../Routes";
import "../App/App.css";
import Login from "../Login/Login";
import useToken from "../App/useToken";
import useVerifyToken from "./useVerifyToken";
import { useLocation } from "react-router-dom";

// This function Returns the current page the user is on
function GetCurrentPage() {
	const location = useLocation();
	//console.log(location.pathname);
	return location.pathname;
}

function App() {
	const { token, setToken } = useToken();
	const { tokenVerify, setTokenVerify } = useVerifyToken(token);
	const token_verification = setTokenVerify;
	//console.log("token is " + token);
	console.log("tokenverify is " + token_verification);
	// If a user does not have an authentication token, a login page is displayed to them
	if (!token || !token_verification) {
		const location = GetCurrentPage();
		console.log("the location is " + location);

		// Don't show the login form on the sign up page
		if (location !== "/signup") {
			return <Login setToken={setToken} />;
		}
	}
	return (
		<div className="App">
			<Routes />
		</div>
	);
}

export default App;
