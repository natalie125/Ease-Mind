import React from "react";
import Main from "./Main";
import "./App.css";
import Login from './Component/Login';
import { useState, useEffect } from "react";
import { Route, Redirect } from 'react-router'
import {Navigate} from 'react-router-dom';

function getToken(){
    const token = sessionStorage.getItem('token');
	if(token){
		return true;
	}
}

export default function App() {

	// return (
	// 	<div className="App">
	// 		<Main />
	// 	</div>
	// );

	//get user's token from session
	// const token = sessionStorage.getItem('token');
    const [token, setToken] = React.useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
          const foundToken = JSON.parse(token);

          setToken(foundToken);
        }
      }, [token]);


	//   return (
	// 	<div className="App">
	// 		<Login setToken={setToken}/>
	// 	</div>
	// );
    

	// if there is no token render the login page again
	if(!token) {
		// return(<Login />)
		// <Navigate to="/login" replace={true} />
		// console.log("Navigating to login")
		return (
			<div className="App">
				{/* <Login setToken={setToken}/> */}
				<Login/>
			</div>
		);
	}

	return (
		<div className="App">
			<Main />
		</div>
	);
}
