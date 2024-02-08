import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EaseMind.css';
import ChatBox from './ChatBox';
import PopUp from './PopUp';

function EaseMind() {
  const [showPopUp, setShowPopUp] = useState(true);

  // Get user email
  const userEmail = sessionStorage.getItem('email')
    ? sessionStorage.getItem('email').substring(1, sessionStorage.getItem('email').length - 1)
    : 'User';

  return (
    <div className="easeMindContainer">
      <h1 className="easeMindTitle">
        Welcome
        {' '}
        {userEmail}
        !
      </h1>
      <div>
        <Link to="/EaseMind_personal_details">
          <button type="button" className="easeMindButton">Create My Details</button>
        </Link>
        <Link to="/EaseMind_anxiety-level-test">
          <button type="button" className="easeMindButton">Anxiety Level Test</button>
        </Link>
        <ChatBox />
      </div>

      {showPopUp && <PopUp onClose={() => setShowPopUp(false)} />}
    </div>
  );
}

export default EaseMind;
