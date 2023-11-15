import React from "react";
import { Link, Routes as Router } from "react-router-dom";
import { Route } from "react-router";

import Login from "./components/Login/Login";
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

const Routes = () => (
  <Router>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login setToken={null} />} />

    <Route path="/error400" element={<Error code="400"><p>Bad HTTP Request</p></Error>} />

    <Route path="/canopy" element={<Canopy />} />
    <Route path="/canopy/canopy2" element={<Canopy2 />} />
    <Route path="/canopy/canopy_view_patient" element={<Canopy_View_Patient />} />
    <Route path="/canopy/canopy_edit_patient" element={<Canopy_Edit_Patient />} />
    <Route path="/canopy/canopy_view_tree" element={<Canopy_View_Tree />} />
    <Route path="/canopy/canopy_edit_tree" element={<Canopy_Edit_Tree />} />
    <Route path="/canopy/canopy_view_condition" element={<Canopy_View_Condition />} />
    <Route path="/canopy/canopy_edit_condition" element={<Canopy_Edit_Condition />} />
    <Route path="/canopy/canopy_show_trees" element={<Canopy_Show_Trees />} />
    <Route path="/canopy/canopy_show_conditions" element={<Canopy_Show_Conditions />} />
    <Route path="/canopy/canopy_edit_node" element={<Canopy_Edit_Node />} />
    <Route path="/canopy/canopy_new_node" element={<Canopy_New_Node />} />
    <Route path="/canopy/canopy_new_node_2" element={<Canopy_New_Node_2 />} />
    <Route path="/canopy/canopy_new_tree" element={<Canopy_New_Tree />} />
    <Route path="/canopy/canopy_new_condition" element={<Canopy_New_Condition />} />

    <Route path="/paralysis-analysis" element={<ParalysisAnalysis />} />

    <Route path="/skin-scan" element={<Kevin />} />
    <Route path="/skin-scan/take_photo" element={<Kevin_Take_Photo />} />
    <Route path="/skin-scan/outcome_positive" element={<Kevin_Outcome_Positive />} />
    <Route path="/skin-scan/outcome_negative" element={<Kevin_Outcome_Negative />} />
    <Route path="/skin-scan/instructions" element={<Kevin_Instructions />} />

    <Route path="/shreyas/shreyas" element={<TonsillitisDetector />} />
    <Route path="/shreyas/tonsillitis_instructions" element={<TonsPhotoInstructions />} />
    <Route path="/shreyas/tonsillitis_outcome_1" element={<TonsillitisOutcome1 />} />
    <Route path="/shreyas/tonsillitis_outcome_2" element={<TonsillitisOutcome2 />} />

    <Route path="/dipstik" element={<DipstikInstructions />} />
    <Route path="/dipstik/dipstik-timer" element={<DipstikTimer />} />
    <Route path="/dipstik/dipstik-camera" element={<DipstikCamera />} />
    <Route path="/dipstik/dipstik-results" element={<DipstikResults />} />

    <Route path="*" element={
      <Error code="404">
        <p>Page Not Found</p>
        <p> Here is the home link:</p>
        <Link to="/home">Home</Link>
      </Error>
    } />
  </Router>
);

export default Routes;
