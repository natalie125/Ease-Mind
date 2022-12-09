import React from "react";
import Main from "./Main";
import "./App.css";
import Login from './Component/Login';
import { useState, useEffect } from "react";


function getToken(){
    const token = sessionStorage.getItem('token');
	if(token){
		return true;
	}
}

export default function App() {
	//get user's token from session
	// const token = sessionStorage.getItem('token');
    const [token, setToken] = React.useState();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
          const foundToken = JSON.parse(token);
          setToken(foundToken);
        }
      }, [token]);
    

	// if there is no token render the login page again
	if(!token) {
		// return(<Login />)
		return (
			<div className="App">
				<Login setToken={setToken}/>
			</div>
		);
	}

	return (
		<div className="App">
			<Main />
		</div>
	);
}
