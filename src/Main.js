import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home/Home";

import Lanre from "./components/Lanre/Lanre";
import Alex from "./components/Alex/Alex";
import Ramat from "./components/Ramat/Ramat";
import Kevin from "./components/Kevin/Kevin";
import Shreyas from "./components/Shreyas/Shreyas";
import Error400 from "./Pages/Error400";
import Error404 from "./Pages/Error404";

const Main = () => {
	// const [loggedIn, setLoggedIn] = React.useState(null);
	const loggedIn = sessionStorage.getItem("token");
	console.log("This is the token");
	console.log(loggedIn);

	return (
		<Routes>
			<Route path="/" element={<Home />}></Route>
			<Route exact path="/signup" element={<SignUp />}></Route>
			<Route exact path="/login" element={<Login />}></Route>
			<Route exact path="/home" element={<Home />}></Route>
			<Route exact path="/error400" element={<Error400 />}></Route>
			<Route exact path="/lanre" element={<Lanre />}></Route>
			<Route exact path="/alex" element={<Alex />}></Route>
			<Route exact path="/ramat" element={<Ramat />}></Route>

			<Route exact path="/kevin" element={<Kevin />}></Route>
			<Route exact path="/shreyas" element={<Shreyas />}></Route>
			<Route path="*" element={<Error404 />}></Route>
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
