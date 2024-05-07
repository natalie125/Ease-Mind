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
import AddNewPatientBasic from './apps/RootsRadar/AddNewPatientBasic';
import MakeModelFromDatabase from './apps/RootsRadar/MakeModelFromDatabase';
import GetPatients from './apps/RootsRadar/GetPatients';
import SystemStatistics from './apps/RootsRadar/SystemStatistics';
import Diagnoses from './apps/RootsRadar/Diagnoses';
import Consent from './apps/RootsRadar/Consent';
import AddNew from './apps/RootsRadar/AddNew';
import SelfReportHistory from './apps/RootsRadar/SelfReportHistory';
import PatientHistoryTree from './apps/RootsRadar/PatientHistoryTree';

import AutismDetector from './apps/AutismDetector/AutismDetector';
import AutismDetectorPersonalDetails from './apps/AutismDetector/personaldetails';
import AutismDetectorQuestionnaireType from './apps/AutismDetector/questionnairetype';
import AutismDetectorAQ10 from './apps/AutismDetector/aq10';
import AutismDetectorAutismSpectrumQuotient from './apps/AutismDetector/autismspectrumquotient';
import AutismDetectorCATQ from './apps/AutismDetector/catq';
import AutismDetectorRAADSR from './apps/AutismDetector/raadsr';
import AutismDetectorTrackingAndNotes from './apps/AutismDetector/trackingandnotes';
import AutismDetectorGame from './apps/AutismDetector/game.js';
import AutismDetectorTest from './apps/AutismDetector/TestComponent‎.js';
import AutismDetectorFeedback from './apps/AutismDetector/feedback.js';
import AutismDetectorEyeTracking from './apps/AutismDetector/eyeTracking.js';

import EaseMind from './apps/EaseMind/EaseMind';
import EaseMindPersonalDetails from './apps/EaseMind/PersonalDetails';
import EaseMindAnxietyLevelTest from './apps/EaseMind/AnxietyLevelTest';
import EaseMindChatBox from './apps/EaseMind/ChatBox';
import EaseMindReport from './apps/EaseMind/report';
import EaseMindTestPage from './apps/EaseMind/TestPage';
import EaseMindSPIN from './apps/EaseMind/SPIN';
import EaseMindPD from './apps/EaseMind/panic';
import EaseMindDailyQ from './apps/EaseMind/DailyQ';
import EaseMindPTSDTest from './apps/EaseMind/PTSD';

import DepressiLess from './apps/DepressiLess/DepressiLess';
import DepressiLessUserInfoForm from './apps/DepressiLess/UserInfoForm';
import DepressiLessTermsOfService from './apps/DepressiLess/TermsOfService';
import DepressiLessOnlineResources from './apps/DepressiLess/OnlineResources';
import DepressiLessUserMedicalHistory from './apps/DepressiLess/UserMedicalHistory';
import DepressiLessUserMentalHealthHistory from './apps/DepressiLess/UserMentalHealthHistory';
import DepressiLessChatSupport from './apps/DepressiLess/ChatSupport';
import DepressiLessTextClassification from './apps/DepressiLess/TextClassification';

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
        <Route path="/roots-radar/add-new-patient-basic" element={<AddNewPatientBasic />} />
        <Route path="/roots-radar/add-new-patient" element={<AddNew />} />
        <Route path="/roots-radar/make-models-from-database" element={<MakeModelFromDatabase />} />
        <Route path="/roots-radar/get-patients" element={<GetPatients />} />
        <Route path="/roots-radar/system-statistics" element={<SystemStatistics />} />
        <Route path="/roots-radar/patient" element={<PatientHistoryTree />} />
        <Route path="/roots-radar/self-report-history" element={<SelfReportHistory />} />
        <Route path="/roots-radar/diagnoses" element={<Diagnoses />} />
        <Route path="/roots-radar/consent" element={<Consent />} />

        <Route path="/EaseMind" element={<EaseMind />} />
        <Route path="/EaseMind_personal_details" element={<EaseMindPersonalDetails />} />
        <Route path="/EaseMind_anxiety-level-test" element={<EaseMindAnxietyLevelTest />} />
        <Route path="/EaseMind_chatbox" element={<EaseMindChatBox />} />
        <Route path="/EaseMind_report" element={<EaseMindReport />} />
        <Route path="/EaseMind_testpage" element={<EaseMindTestPage />} />
        <Route path="/EaseMind_spin" element={<EaseMindSPIN />} />
        <Route path="/EaseMind_pd" element={<EaseMindPD />} />
        <Route path="/EaseMind_dailyQ" element={<EaseMindDailyQ />} />
        <Route path="/EaseMind_ptsd" element={<EaseMindPTSDTest />} />

        <Route path="/autism_instructions" element={<AutismDetector />} />
        <Route path="/autism_instructions/personaldetails" element={<AutismDetectorPersonalDetails />} />
        <Route path="/autism_instructions/questionnairetype" element={<AutismDetectorQuestionnaireType />} />
        <Route path="/autism_instructions/aq10" element={<AutismDetectorAQ10 />} />
        <Route path="/autism_instructions/autismspectrumquotient" element={<AutismDetectorAutismSpectrumQuotient />} />
        <Route path="/autism_instructions/cat_q" element={<AutismDetectorCATQ />} />
        <Route path="/autism_instructions/raads_r" element={<AutismDetectorRAADSR />} />
        <Route path="/autism_instructions/trackingandnotes" element={<AutismDetectorTrackingAndNotes />} />
        <Route path="/autism_instructions/game" element={<AutismDetectorGame />} />
        <Route path="/autism_instructions/test" element={<AutismDetectorTest />} />
        <Route path="/autism_instructions/eyeTracking" element={<AutismDetectorEyeTracking />} />
        <Route path="/autism_instructions/feedback" element={<AutismDetectorFeedback />} />

        <Route path="/DepressiLess" element={<DepressiLess />} />
        <Route path="/DepressiLess/UserInfoForm" element={<DepressiLessUserInfoForm />} />
        <Route path="/DepressiLess/TermsOfService" element={<DepressiLessTermsOfService />} />
        <Route path="/DepressiLess/OnlineResources" element={<DepressiLessOnlineResources />} />
        <Route path="/DepressiLess/UserMentalHealthHistory" element={<DepressiLessUserMentalHealthHistory />} />
        <Route path="/DepressiLess/UserMedicalHistory" element={<DepressiLessUserMedicalHistory />} />
        <Route path="/DepressiLess/ChatSupport" element={<DepressiLessChatSupport />} />
        <Route path="/DepressiLess/TextClassification" element={<DepressiLessTextClassification />} />
        <Route path="/DepressiLess/OnlineResources" element={<DepressiLessOnlineResources />} />

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
