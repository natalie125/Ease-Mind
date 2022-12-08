import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";

import Lanre from "./Pages/Lanre";
import Alex from "./Pages/Alex";
import Ramat from "./Pages/Ramat";
import Kevin from "./Pages/Kevin";
import Shreyas from "./Pages/Shreyas";

const Main = () => {
	return (
		<Routes>
			<Route path="/" element={<Login />}></Route>
			<Route exact path="/signup" element={<SignUp />}></Route>
			<Route exact path="/home" element={<Home />}></Route>
			<Route exact path="/lanre" element={<Lanre />}></Route>
			<Route exact path="/alex" element={<Alex />}></Route>
			<Route exact path="/ramat" element={<Ramat />}></Route>
			<Route exact path="/kevin" element={<Kevin />}></Route>
			<Route exact path="/shreyas" element={<Shreyas />}></Route>
		</Routes>
	);
};

export default Main;
