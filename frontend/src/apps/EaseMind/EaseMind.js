import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './EaseMind.css';
import ChatBox from './ChatBox';

// Pop up
function PopUp({ show, onClose }) {
  if (!show) {
    return null;
  }

  return (
    <div className="popupBackground">
      <div className="popupContent">
        <button type="button" className="popupClose" onClick={onClose}>&times;</button>
        <h1>Warning:</h1>
        <br />
        <p>
          This website is a project developed by a computer science student and is not a professional resource
          for individuals with anxiety issues. If you are experiencing anxiety, please consult with qualified
          professionals. Be aware that the content on this site might cause discomfort for some users.
        </p>
      </div>
    </div>
  );
}

// Define PropTypes for PopUp
PopUp.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

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
        <Link to="/anxiety-level-test">
          <button type="button" className="easeMindButton">Anxiety Level Test</button>
        </Link>
        <ChatBox />
      </div>

      <PopUp show={showPopUp} onClose={() => setShowPopUp(false)} />
    </div>
  );
}

export default EaseMind;
