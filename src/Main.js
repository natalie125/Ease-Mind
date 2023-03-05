import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home/Home";

import Lanre from "./components/Lanre/Lanre";
import Canopy from "./components/Alex/Canopy";
import Canopy2 from "./components/Alex/Canopy2";
import Canopy_View_Tree from "./components/Alex/Canopy_View_Tree";
import Canopy_Edit_Tree from "./components/Alex/Canopy_Edit_Tree";
import Canopy_View_Patient from "./components/Alex/Canopy_View_Patient";
import Canopy_Edit_Patient from "./components/Alex/Canopy_Edit_Patient";
import Canopy_View_Condition from "./components/Alex/Canopy_View_Condition";
import Canopy_Edit_Condition from "./components/Alex/Canopy_Edit_Condition";
import Canopy_Show_Trees from "./components/Alex/Canopy_Show_Trees";
import Canopy_Edit_Node from "./components/Alex/Canopy_Edit_Node";
import Ramat from "./components/Ramat/Ramat";
import Kevin from "./components/Kevin/Kevin";
import Shreyas from "./components/Shreyas/Shreyas";
import Error400 from "./Pages/Error400";
import Error404 from "./Pages/Error404";

const Main = () => {
	// const [loggedIn, setLoggedIn] = React.useState(null);
	// const loggedIn = sessionStorage.getItem("token");
	// console.log("This is the token");
	// console.log(loggedIn);

	return (
		<Routes>
			<Route path="/" element={<Home />}></Route>
			<Route exact path="/signup" element={<SignUp />}></Route>
			<Route exact path="/login" element={<Login />}></Route>
			<Route exact path="/home" element={<Home />}></Route>
			<Route exact path="/error400" element={<Error400 />}></Route>
			<Route exact path="/lanre" element={<Lanre />}></Route>
			<Route exact path="/canopy" element={<Canopy />}></Route>
			<Route exact path="/canopy/canopy2" element={<Canopy2 />}></Route>
			<Route exact path="/canopy/canopy_view_patient" element={<Canopy_View_Patient />}></Route>
			<Route exact path="/canopy/canopy_edit_patient" element={<Canopy_Edit_Patient />}></Route>
			<Route exact path="/canopy/canopy_view_tree" element={<Canopy_View_Tree />}></Route>
			<Route exact path="/canopy/canopy_edit_tree" element={<Canopy_Edit_Tree />}></Route>
			<Route exact path="/canopy/canopy_view_condition" element={<Canopy_View_Condition />}></Route>
			<Route exact path="/canopy/canopy_edit_condition" element={<Canopy_Edit_Condition />}></Route>
			<Route exact path="/canopy/canopy_show_trees" element={<Canopy_Show_Trees />}></Route>
			<Route exact path="/canopy/canopy_edit_node" element={<Canopy_Edit_Node />}></Route>
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
