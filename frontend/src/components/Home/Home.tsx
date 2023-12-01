import React, { useState } from "react";
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
import homeImage from "../../images/home.png";

interface IAppLink {
  to: string;
  logo: string;
  alt: string;
  slogan: string;
}

const AppLink = ({ to, logo, alt, slogan }: IAppLink) => {
  const [showSlogan, setShowSlogan] = useState(false);

  return (
    <Link
      className="app-link"
      to={to}
      onMouseEnter={() => setShowSlogan(true)}
      onMouseLeave={() => setShowSlogan(false)}
    >
      <div className="logo-container">
        <img src={logo} alt={alt} />
        {showSlogan && <div className="slogan-container">{slogan}</div>}
      </div>
    </Link>
  );
};

const Home = () => {
  const appLinks: IAppLink[] = [
    {
      to: "/canopy",
      logo: canopy_logo,
      alt: "Canopy_App_Alex",
      slogan: "Empowering healthcare solutions."
    },
    {
      to: "/skin-scan",
      logo: skinscan_logo,
      alt: "Skin-Scan_App_Kevin",
      slogan: "Empowering healthcare solutions."
    },
    {
      to: "/dipstik",
      logo: dipstik_logo,
      alt: "Dipstik_App_Lanre",
      slogan: "Empowering healthcare solutions."
    },
    {
      to: "/paralysis-analysis",
      logo: paralysis_analysis_logo,
      alt: "Stroke_App_Ramat",
      slogan: "Empowering healthcare solutions."
    },
    {
      to: "/shreyas/tonsillitis_instructions",
      logo: tonsillitis_detector_logo,
      alt: "Tonsilitis_App_Shreyas",
      slogan: "Empowering healthcare solutions."
    },
    {
      to: "/roots-radar",
      logo: roots_radar_logo,
      alt: "Roots Radar App",
      slogan: "Empowering healthcare solutions."
    },
    {
      to: "/EaseMind",
      logo: ease_mind_logo,
      alt: "EaseMind App",
      slogan: "Empowering healthcare solutions."
    },
    {
      to: "/autism_instructions",
      logo: autism_detector_logo,
      alt: "Autism_App",
      slogan: "Always Unique Totally Intelligent Sometimes Mysterious"
    },
    {
      to: "/food_allergy_chatbot",
      logo: chatbot_logo,
      alt: "chatbot_Logo",
      slogan: "Empowering healthcare solutions."
    },
  ];

  return (
    <div className="home">
      <div className="app-links-container">
        {appLinks.map((app, index) => (
          <AppLink
            key={index}
            to={app.to}
            logo={app.logo}
            alt={app.alt}
            slogan={app.slogan}
          />
        ))}
      </div>
      <img src={homeImage} alt="home" className="home-image" />
    </div>
  );
};

export default Home;