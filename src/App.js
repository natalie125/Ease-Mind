import React from "react";
import Main from "./Main";
import "./App.css";
import Login from './Component/Login';


export default function App() {
	// const [token, setToken] = React.useState();

	if(!token) {
		return <Login setToken={setToken} />
	  }

	return (
		<div className="App">
			<Main />
		</div>
	);
}
