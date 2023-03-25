import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home/Home";

import Canopy from "./components/Alex/Canopy";
import Canopy2 from "./components/Alex/Canopy2";
import Canopy_View_Tree from "./components/Alex/Canopy_View_Tree";
import Canopy_Edit_Tree from "./components/Alex/Canopy_Edit_Tree";
import Canopy_View_Patient from "./components/Alex/Canopy_View_Patient";
import Canopy_Edit_Patient from "./components/Alex/Canopy_Edit_Patient";
import Canopy_View_Condition from "./components/Alex/Canopy_View_Condition";
import Canopy_Edit_Condition from "./components/Alex/Canopy_Edit_Condition";
import Canopy_Show_Trees from "./components/Alex/Canopy_Show_Trees";
import Canopy_Show_Conditions from "./components/Alex/Canopy_Show_Conditions";
import Canopy_Edit_Node from "./components/Alex/Canopy_Edit_Node";
import Canopy_New_Node from "./components/Alex/Canopy_New_Node";
import Canopy_New_Node_2 from "./components/Alex/Canopy_New_Node_2";
import Canopy_New_Tree from "./components/Alex/Canopy_New_Tree";
import Canopy_New_Condition from "./components/Alex/Canopy_New_Condition";
import Ramat from "./components/Ramat/Ramat";
import Kevin from "./components/Kevin/Kevin";
import Shreyas from "./components/Shreyas/Shreyas";
import TonsPhotoInstructions from "./components/Shreyas/TonsPhotoInstructions";
import TonsillitisOutcome1 from "./components/Shreyas/TonsillitsOutcome1";
import TonsillitisOutcome2 from "./components/Shreyas/TonsillitisOutcome2";
import Error400 from "./Pages/Error400";
import Error404 from "./Pages/Error404";

import DipstikInstructions from "./components/Lanre/DipstikHome";
import DipstikTimer from "./components/Lanre/DipstikTimer";
import DipstikCamera from "./components/Lanre/DipstikCamera";
import DipstikResults from "./components/Lanre/DipstikResults";

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
			<Route exact path="/canopy" element={<Canopy />}></Route>
			<Route exact path="/canopy/canopy2" element={<Canopy2 />}></Route>
			<Route exact path="/canopy/canopy_view_patient" element={<Canopy_View_Patient />}></Route>
			<Route exact path="/canopy/canopy_edit_patient" element={<Canopy_Edit_Patient />}></Route>
			<Route exact path="/canopy/canopy_view_tree" element={<Canopy_View_Tree />}></Route>
			<Route exact path="/canopy/canopy_edit_tree" element={<Canopy_Edit_Tree />}></Route>
			<Route exact path="/canopy/canopy_view_condition" element={<Canopy_View_Condition />}></Route>
			<Route exact path="/canopy/canopy_edit_condition" element={<Canopy_Edit_Condition />}></Route>
			<Route exact path="/canopy/canopy_show_trees" element={<Canopy_Show_Trees />}></Route>
			<Route exact path="/canopy/canopy_show_conditions" element={<Canopy_Show_Conditions />}></Route>
			<Route exact path="/canopy/canopy_edit_node" element={<Canopy_Edit_Node />}></Route>
			<Route exact path="/canopy/canopy_new_node" element={<Canopy_New_Node />}></Route>
			<Route exact path="/canopy/canopy_new_node_2" element={<Canopy_New_Node_2 />}></Route>
			<Route exact path="/canopy/canopy_new_tree" element={<Canopy_New_Tree />}></Route>
			<Route exact path="/canopy/canopy_new_condition" element={<Canopy_New_Condition />}></Route>
			<Route exact path="/ramat" element={<Ramat />}></Route>
			<Route exact path="/kevin" element={<Kevin />}></Route>
			<Route exact path="/shreyas/shreyas" element={<Shreyas />}></Route>
			<Route exact path="/shreyas/tonsillitis_instructions" element={<TonsPhotoInstructions />}></Route>
			<Route exact path="/shreyas/tonsillitis_outcome_1" element={<TonsillitisOutcome1 />}></Route>
			<Route exact path="/shreyas/tonsillitis_outcome_2" element={<TonsillitisOutcome2 />}></Route>
			<Route path="*" element={<Error404 />}></Route>
			<Route exact path="/dipstik" element={<DipstikInstructions />}></Route>
			<Route exact path="/dipstik/dipstik-timer" element={<DipstikTimer />}></Route>
			<Route exact path="/dipstik/dipstik-camera" element={<DipstikCamera/>}></Route>
			<Route exact path="/dipstik/dipstik-results" element={<DipstikResults />}></Route>
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
