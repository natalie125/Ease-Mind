import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

import canopy_logo from "./logos/canopy.png";
import dipstik_logo from "./logos/dipstik.png";
import paralysis_analysis_logo from "./logos/paralysis-analysis.png";
import tonsillitis_detector_logo from "./logos/tonsillitis-detector.png";
import roots_radar_logo from "./logos/roots-radar.png";
import skinscan_logo from "./logos/skinscan.png";
import ease_mind_logo from "./logos/ease-mind.png";
import autism_detector_logo from "./logos/autism-detector.png";
import chatbot_logo from "./logos/chatbot.png"
import DepressiLess_logo from "./logos/DepressiLess-logo.png"

interface IAppLink {
  to: string;
  logo: any;
  alt: string;
  dataCy: string;
}

const AppLink = ({ to, logo, alt, dataCy }: IAppLink) => (
  <Link className="app-link" to={to}>
    <img data-cy={dataCy} src={logo} alt={alt} />
  </Link>
);

const Home = () => (
  <div className="home">
    <h1>Home</h1>
    <div data-cy="homeBtnContainer">
      <AppLink
        to="/canopy"
        logo={canopy_logo}
        alt="Canopy_App_Alex"
        dataCy="alexAppLogo"
      />

      <AppLink
        to="/skin-scan"
        logo={skinscan_logo}
        alt="Skin-Scan_App_Kevin"
        dataCy="kevinAppLogo"
      />

      <AppLink
        to="/dipstik"
        logo={dipstik_logo}
        alt="Dipstik_App_Lanre"
        dataCy="lanreAppLogo"
      />

      <AppLink
        to="/paralysis-analysis"
        logo={paralysis_analysis_logo}
        alt="Stroke_App_Ramat"
        dataCy="paralysisAnalysisLink"
      />

      <AppLink
        to="/shreyas/tonsillitis_instructions"
        logo={tonsillitis_detector_logo}
        alt="Tonsilitis_App_Shreyas"
        dataCy="shreyasAppLogo"
      />

      <AppLink
        to="/roots-radar"
        logo={roots_radar_logo}
        alt="Roots Radar App"
        dataCy="Roots-Radar-App"
      />

      <AppLink
        to="/EaseMind"
        logo={ease_mind_logo}
        alt="EaseMind App"
        dataCy="easelogo"
      />

      <AppLink
        to="/autism_instructions"
        logo={autism_detector_logo}
        alt="Autism_App"
        dataCy="ayeshasAppLogo"
      />

      <AppLink
        to="/food_allergy_chatbot"
        logo={chatbot_logo}
        alt="chatbot_Logo"
        dataCy="chatbotlogo"
      />

      <AppLink
        to="/DepressiLess"
        logo={DepressiLess_logo}
        alt="DepressiLess App"
        dataCy="DepressiLessLogo"
      />
    </div>
  </div>
);

export default Home;
