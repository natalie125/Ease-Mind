import React, { useContext } from "react";
import {
  Link, Routes as Router, Navigate, Outlet, Route
} from "react-router-dom";

import { AuthTokenContext } from "./App";

import AuthenticationLayout from "./components/AuthenticationLayout/AuthenticationLayout";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home/Home";
import Error from "./components/Error";

import Canopy from "./apps/Canopy/Canopy";
import Canopy2 from "./apps/Canopy/Canopy2";
import Canopy_View_Tree from "./apps/Canopy/Canopy_View_Tree";
import Canopy_Edit_Tree from "./apps/Canopy/Canopy_Edit_Tree";
import Canopy_View_Patient from "./apps/Canopy/Canopy_View_Patient";
import Canopy_Edit_Patient from "./apps/Canopy/Canopy_Edit_Patient";
import Canopy_View_Condition from "./apps/Canopy/Canopy_View_Condition";
import Canopy_Edit_Condition from "./apps/Canopy/Canopy_Edit_Condition";
import Canopy_Show_Trees from "./apps/Canopy/Canopy_Show_Trees";
import Canopy_Show_Conditions from "./apps/Canopy/Canopy_Show_Conditions";
import Canopy_Edit_Node from "./apps/Canopy/Canopy_Edit_Node";
import Canopy_New_Node from "./apps/Canopy/Canopy_New_Node";
import Canopy_New_Node_2 from "./apps/Canopy/Canopy_New_Node_2";
import Canopy_New_Tree from "./apps/Canopy/Canopy_New_Tree";
import Canopy_New_Condition from "./apps/Canopy/Canopy_New_Condition";

import ParalysisAnalysis from "./apps/ParalysisAnalysis/ParalysisAnalysis";

import Kevin from "./apps/SkinScan/Kevin";
import Kevin_Take_Photo from "./apps/SkinScan/Kevin_Take_Photo";
import Kevin_Outcome_Positive from "./apps/SkinScan/Kevin_Outcome_Positive";
import Kevin_Outcome_Negative from "./apps/SkinScan/Kevin_OutcomeNegative";
import Kevin_Instructions from "./apps/SkinScan/Kevin_Instructions";

import TonsillitisDetector from "./apps/TonsillitisDetector/TonsillitisDetector";
import TonsPhotoInstructions from "./apps/TonsillitisDetector/TonsPhotoInstructions";
import TonsillitisOutcome1 from "./apps/TonsillitisDetector/TonsillitsOutcome1";
import TonsillitisOutcome2 from "./apps/TonsillitisDetector/TonsillitisOutcome2";

import DipstikInstructions from "./apps/Dipstik/DipstikHome";
import DipstikTimer from "./apps/Dipstik/DipstikTimer";
import DipstikCamera from "./apps/Dipstik/DipstikCamera";
import DipstikResults from "./apps/Dipstik/DipstikResults";

import RootsRadar from "./apps/RootsRadar/RootsRadar";

import AutismDetector from "./apps/AutismDetector/AutismDetector";

import PersonalDetails from "./apps/AutismDetector/personaldetails";

import EaseMind from './apps/EaseMind/EaseMind'; 
import EaseMindPersonaldetails from './apps/EaseMind/EaseMind_personal_details'; 

import DepressiLess from './apps/DepressiLess/DepressiLess';


// If we want to check each time? Maybe it could be a use memo for when the token changes only?
// https://stackoverflow.com/questions/60017604/react-router-check-that-jwt-is-valid-before-rendering-a-private-route

const RouteProtector = () => {
  const authorised = useContext(AuthTokenContext).token;
  return authorised ? <Outlet/> : <Navigate to="/auth/signin"/>;
}

const Routes = () => (
  <Router>
    <Route path="/auth" element={<AuthenticationLayout />}>
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
    </Route>

    <Route path="/" element={<RouteProtector />}>
      <Route path="/" element={<Navigate to="/home"/>} />
      <Route path="/home" element={<Home />} />

      <Route path="/canopy" element={<Outlet />}>
        <Route path="" element={<Canopy />} />
        <Route path="canopy2" element={<Canopy2 />} />
        <Route path="canopy_view_patient" element={<Canopy_View_Patient />} />
        <Route path="canopy_edit_patient" element={<Canopy_Edit_Patient />} />
        <Route path="canopy_view_tree" element={<Canopy_View_Tree />} />
        <Route path="canopy_edit_tree" element={<Canopy_Edit_Tree />} />
        <Route path="canopy_view_condition" element={<Canopy_View_Condition />} />
        <Route path="canopy_edit_condition" element={<Canopy_Edit_Condition />} />
        <Route path="canopy_show_trees" element={<Canopy_Show_Trees />} />
        <Route path="canopy_show_conditions" element={<Canopy_Show_Conditions />} />
        <Route path="canopy_edit_node" element={<Canopy_Edit_Node />} />
        <Route path="canopy_new_node" element={<Canopy_New_Node />} />
        <Route path="canopy_new_node_2" element={<Canopy_New_Node_2 />} />
        <Route path="canopy_new_tree" element={<Canopy_New_Tree />} />
        <Route path="canopy_new_condition" element={<Canopy_New_Condition />} />
      </Route>

      <Route path="/paralysis-analysis" element={<ParalysisAnalysis />} />

      <Route path="/skin-scan" element={<Outlet />}>
        <Route path="" element={<Kevin />} />
        <Route path="take_photo" element={<Kevin_Take_Photo />} />
        <Route path="outcome_positive" element={<Kevin_Outcome_Positive />} />
        <Route path="outcome_negative" element={<Kevin_Outcome_Negative />} />
        <Route path="instructions" element={<Kevin_Instructions />} />
      </Route>

      <Route path="/shreyas" element={<Outlet />}>
        <Route path="shreyas" element={<TonsillitisDetector />} />
        <Route path="tonsillitis_instructions" element={<TonsPhotoInstructions />} />
        <Route path="tonsillitis_outcome_1" element={<TonsillitisOutcome1 />} />
        <Route path="tonsillitis_outcome_2" element={<TonsillitisOutcome2 />} />
      </Route>

      <Route path="/dipstik" element={<Outlet />}>
        <Route path="" element={<DipstikInstructions />} />
        <Route path="dipstik-timer" element={<DipstikTimer />} />
        <Route path="dipstik-camera" element={<DipstikCamera />} />
        <Route path="dipstik-results" element={<DipstikResults />} />
      </Route>

      <Route path="/roots-radar" element={<RootsRadar />} />

      <Route path="/EaseMind" element={<EaseMind />} />
      <Route path="/EaseMind_personal_details" element={<EaseMindPersonaldetails />} />
      <Route path="/autism_instructions" element={<AutismDetector/>} />
      <Route path="/autism_instructions/personaldetails" element={<PersonalDetails/>} />

      <Route path="/DepressiLess" element={<DepressiLess />} />
      
    </Route>

    {/* TODO: We need to add a proper error page or pages. */}
    <Route path="/error400" element={
      <Error code="400"><p>Bad HTTP Request</p></Error>
    } />

    <Route path="*" element={
      <Error code="404">
        <p>Page Not Found</p>
        <p>Here is the home link:</p>
        <Link to="/home">Home</Link>
      </Error>
    } />
  </Router>
);

export default Routes;