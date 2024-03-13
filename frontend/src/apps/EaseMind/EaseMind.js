import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EaseMind.css';
import ChatBox from './ChatBox';
import PopUp from './PopUp';

function EaseMind() {
  const [showPopUp, setShowPopUp] = useState(() => {
    const hasAgreed = localStorage.getItem('hasAgreedToPopUp');
    return !hasAgreed;
  });

  const [showChatBox, setShowChatBox] = useState(false);

  const userEmail = sessionStorage.getItem('email')
    ? sessionStorage.getItem('email').substring(1, sessionStorage.getItem('email').length - 1)
    : 'User';

  const handlePopUpClose = () => {
    setShowPopUp(false);
    localStorage.setItem('hasAgreedToPopUp', 'true');
  };

  // Toggle function for ChatBox visibility
  const toggleChatBox = () => {
    setShowChatBox(!showChatBox);
  };

  return (
    <div className="easeMindContainer">
      <h1 className="easeMindTitle">
        Welcome&nbsp;
        {userEmail}
        !
      </h1>
      <div>
        <Link to="/EaseMind_personal_details">
          <button type="button" className="easeMindButton">Edit My Details</button>
        </Link>
        <Link to="/EaseMind_testpage">
          <button type="button" className="easeMindButton">Anxiety Tests</button>
        </Link>
        <Link to="/EaseMind_report">
          <button type="button" className="easeMindButton">Report</button>
        </Link>
        <Link to="/EaseMind_dailyQ">
          <button type="button" className="easeMindButton">Daily Questionnaire</button>
        </Link>
        {/* Toggle Button for ChatBox */}
        <button type="button" className="easeMindButton" onClick={toggleChatBox}>
          {showChatBox ? 'Hide Chat' : 'Chat Box'}
        </button>
        {showChatBox && <ChatBox />}
      </div>

      {showPopUp && <PopUp onClose={handlePopUpClose} />}
    </div>
  );
}

export default EaseMind;
