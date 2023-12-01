//MainContent.js
import React from 'react';
import InteractiveArea from './InteractiveArea';
import userProfileLogo from '../../images/userinformation-logo.png';
import supportChatLogo from '../../images/supportchat-logo.png';
import questionnaireLogo from '../../images/questionnaire-logo.png';
import onlineResourcesLogo from '../../images/onlineresources-logo.png';

const MainContent = () => {
  return (
    <div>
      <InteractiveArea title="User Profile" icon={userProfileLogo} onClick={() => {/* handle click */}} />
      {/* Repeat for other areas using InteractiveArea */}
    </div>
  );
};

export default MainContent;
