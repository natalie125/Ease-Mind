import React from "react";
import { Routes } from "react-router-dom";
import { Route, Redirect } from 'react-router'
import Login from "./Pages/Login2";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";

import Lanre from "./Pages/Lanre";
import Alex from "./Pages/Alex";
import Ramat from "./Pages/Ramat";
import Kevin from "./Pages/Kevin";
import Shreyas from "./Pages/Shreyas";
import {Navigate} from 'react-router-dom';

const Main = () => {
	// const [loggedIn, setLoggedIn] = React.useState(null);
	const loggedIn = sessionStorage.getItem("token");
	console.log("This is the token");
	console.log(loggedIn);
	

	return (
		<Routes>
			<Route path="/" element={<Login />}></Route>
			<Route exact path="/signup" element={<SignUp />}></Route>
			<Route exact path="/home" element={<Home />}></Route>
			<Route exact path="/lanre" element={<Lanre />}></Route>
			{/* <Route exact path="/lanre" element={<Lanre/>} render={() => (
  				loggedIn ? (
    				<Navigate to="/home" replace={true} />
  				) : (
    				<Navigate to="/login" replace={true} />
					// element={<Login/>}

				)
			)}/>			 */}

			<Route exact path="/alex" element={<Alex />}></Route>
			<Route exact path="/ramat" element={<Ramat />}></Route>
			<Route exact path="/kevin" element={<Kevin />}></Route>
			<Route exact path="/shreyas" element={<Shreyas />}></Route>
		</Routes>
	);
};

export default Main;


// import { Route, Redirect } from 'react-router'

// <Route exact path="/" render={() => (
//   loggedIn ? (
//     <Redirect to="/dashboard"/>
//   ) : (
//     <PublicHomePage/>
//   )
// )}/>