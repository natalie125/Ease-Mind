import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Alex from "./Pages/Alex";

const Main = () => {
	return (
		<Routes>
			<Route path="/" element={<Login />}></Route>
			<Route exact path="/home" element={<Home />}></Route>
			<Route exact path="/alex" element={<Alex />}></Route>
		</Routes>
	);
};

export default Main;
