import React from 'react';
import { Link } from 'react-router-dom';

import userProfileLogo from '../../images/userinformation-logo.png';
import supportChatLogo from '../../images/supportchat-logo.png';
import questionnaireLogo from '../../images/questionnaire-logo.png';
import onlineResourcesLogo from '../../images/onlineresources-logo.png';

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh', // Adjust the height to make it square
  marginTop: '-50px',
};

const buttonStyle = {
  width: '150px',
  height: '150px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  margin: '5px',
};

const messageStyle = {
  marginBottom: '20px', // Add margin to create space between the message and buttons
  fontSize: '24px', // Change the font size
  color: 'blue', // Change the text color
};

function DepressiLess() {
  const userEmail = sessionStorage.getItem('email')
    ? sessionStorage.getItem('email').substring(1, sessionStorage.getItem('email').length - 1)
    : 'User';

  return (
    <div className="DepressiLess" style={containerStyle}>
      <div>
        <div style={{ textAlign: 'center', ...messageStyle }}>
          <b>
            <h1>
              Welcome
              {userEmail}
              !
            </h1>
          </b>
        </div>
        <br />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
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
      </div>
    </div>
  );
}

export default DepressiLess;
