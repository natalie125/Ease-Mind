import React from 'react';
import { Link } from "react-router-dom";
import Header from '../../components/Header'

import userProfileLogo from '../../images/userinformation-logo.png';
import supportChatLogo from '../../images/supportchat-logo.png';
import questionnaireLogo from '../../images/questionnaire-logo.png';
import onlineResourcesLogo from '../../images/onlineresources-logo.png';

const buttonStyle = {
  width: "150px",
  height: "150px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  margin: "5px",
};

const DepressiLess = () => {
  const userEmail = sessionStorage.getItem("email") ? sessionStorage.getItem("email").substring(1, sessionStorage.getItem("email").length - 1) : "User";

  return (
    <div className="DepressiLess">
      <Header />
      <MainContent />
      {/* Greet the user */}
      <div style={{ textAlign: 'center' }}>
        <b><h1>Welcome {userEmail}!</h1></b>
      </div>
      <br />
      {/* Interactive areas with Link */}
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <Link to="/depressiless/user-profile">
          <img src={userProfileLogo} alt="User Profile" style={buttonStyle} />
        </Link>
        <Link to="/depressiless/chat-support">
          <img src={supportChatLogo} alt="Chat with Support" style={buttonStyle} />
        </Link>
        <Link to="/depressiless/fill-questionnaire">
          <img src={questionnaireLogo} alt="Fill Questionnaire" style={buttonStyle} />
        </Link>
        <Link to="/depressiless/online-resources">
          <img src={onlineResourcesLogo} alt="Online Resources" style={buttonStyle} />
        </Link>
      </div>
      {/* Add more content as needed */}
    </div>
  );
};

export default DepressiLess;
