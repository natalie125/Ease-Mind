import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EaseMind.css';
import ChatBox from './ChatBox';
import PopUp from './PopUp';

function EaseMind() {
  // Initialize showPopUp based on whether the user has already agreed to the pop-up
  const [showPopUp, setShowPopUp] = useState(() => {
    const hasAgreed = localStorage.getItem('hasAgreedToPopUp');
    return !hasAgreed;
  });

  // Get user email
  const userEmail = sessionStorage.getItem('email')
    ? sessionStorage.getItem('email').substring(1, sessionStorage.getItem('email').length - 1)
    : 'User';

  // Function to call when the PopUp is closed
  const handlePopUpClose = () => {
    setShowPopUp(false);
    localStorage.setItem('hasAgreedToPopUp', 'true'); // Save flag indicating user has agreed
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
        <Link to="/EaseMind_anxiety-level-test">
          <button type="button" className="easeMindButton">Anxiety Level Test</button>
        </Link>
        <ChatBox />
      </div>

      {showPopUp && <PopUp onClose={handlePopUpClose} />}
    </div>
  );
}

export default EaseMind;
