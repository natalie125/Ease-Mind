import React, { useContext } from 'react';
import {
  Routes as Router, Navigate, Outlet, Route,
} from 'react-router-dom';

import { devPublicUrl, prodPublicUrl } from './utils/urls';

import { AuthTokenContext } from './App';

import AuthenticationLayout from './components/AuthenticationLayout/AuthenticationLayout';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home/Home';
import Error from './components/Error';
import PageNotFound from './components/PageNotFound/PageNotFound';

import ParalysisAnalysis from './apps/ParalysisAnalysis/ParalysisAnalysis';

import SkinScan from './apps/SkinScan/Kevin';
import TakePhoto from './apps/SkinScan/KevinTakePhoto';
import OutcomePositive from './apps/SkinScan/KevinOutcomePositive';
import OutcomeNegative from './apps/SkinScan/KevinOutcomeNegative';
import Instructions from './apps/SkinScan/KevinInstructions';

import TonsillitisDetector from './apps/TonsillitisDetector/TonsillitisDetector';
import TonsPhotoInstructions from './apps/TonsillitisDetector/TonsPhotoInstructions';
import TonsillitisOutcome1 from './apps/TonsillitisDetector/TonsillitsOutcome1';
import TonsillitisOutcome2 from './apps/TonsillitisDetector/TonsillitisOutcome2';

import DipstikInstructions from './apps/Dipstik/DipstikHome';
import DipstikTimer from './apps/Dipstik/DipstikTimer';
import DipstikCamera from './apps/Dipstik/DipstikCamera';
import DipstikResults from './apps/Dipstik/DipstikResults';

import RootsRadar from './apps/RootsRadar/RootsRadar';

import AutismDetector from './apps/AutismDetector/AutismDetector';

import AutismDetectorPersonalDetails from './apps/AutismDetector/personaldetails';
import AutismDetectorQuestionnaire from './apps/AutismDetector/questionnaire';

import EaseMind from './apps/EaseMind/EaseMind';
import EaseMindPersonalDetails from './apps/EaseMind/PersonalDetails';

import DepressiLess from './apps/DepressiLess/DepressiLess';

// If we want to check each time? Maybe it could be a use memo for when the token changes only?
// https://stackoverflow.com/questions/60017604/react-router-check-that-jwt-is-valid-before-rendering-a-private-route

function RouteProtector() {
  const authorised = useContext(AuthTokenContext).token;
  return authorised ? <Outlet /> : <Navigate to="/auth/signin" />;
}

function Routes() {
  return (
    <Router>
      <Route path="/auth" element={<AuthenticationLayout />}>
        <Route path="" element={<Navigate to="/auth/signin" />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>

      <Route path="/" element={<RouteProtector />}>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />

        <Route path="/paralysis-analysis" element={<ParalysisAnalysis />} />

        <Route path="/skin-scan" element={<Outlet />}>
          <Route path="" element={<SkinScan />} />
          <Route path="take_photo" element={<TakePhoto />} />
          <Route path="outcome_positive" element={<OutcomePositive />} />
          <Route path="outcome_negative" element={<OutcomeNegative />} />
          <Route path="instructions" element={<Instructions />} />
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
        <Route path="/EaseMind_personal_details" element={<EaseMindPersonalDetails />} />

        <Route path="/autism_instructions" element={<AutismDetector />} />
        <Route path="/autism_instructions/personaldetails" element={<AutismDetectorPersonalDetails />} />
        <Route path="/autism_instructions/questionnaire" element={<AutismDetectorQuestionnaire />} />

        <Route path="/DepressiLess" element={<DepressiLess />} />

      </Route>

      {/* TODO: We need to add a proper error page or pages. */}
      <Route
        path="/error400"
        element={
          <Error code="400"><p>Bad HTTP Request</p></Error>
        }
      />

      <Route path={devPublicUrl} element={<Navigate to="/home" />} />
      <Route path={prodPublicUrl} element={<Navigate to="/home" />} />

      <Route
        path="*"
        element={<PageNotFound />}
      />
    </Router>
  );
}

export default Routes;
