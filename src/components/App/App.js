import React from "react";
import Main from "../../Main";
import "../App/App.css";
import Login from '../Login/Login';
import useToken from '../App/useToken';
import { useLocation } from 'react-router-dom'


function GetCurrentPage() {
	const location = useLocation();
	console.log(location.pathname);
	return location.pathname
}

function App() {
	const { token, setToken } = useToken();

	if(!token) {
		const location = GetCurrentPage();
		console.log(location)

		// youre not on signup page, show the login page
		if(location != "/signup" ){
			return <Login setToken={setToken} />
		}
	}

	return (
		<div className="App">
			<Main />
		</div>
	);
}

export default App;