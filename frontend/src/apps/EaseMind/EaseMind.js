import React from 'react';
import { Link } from 'react-router-dom';
import './EaseMind.css';

function EaseMind() {
  // const handleButtonClick = (buttonName) => {
  //   console.log(`Button clicked: ${buttonName}`);
  // };

  return (
    <div className="easeMindContainer">
      <h1 className="easeMindTitle">Welcome!</h1>

      <div>
        <Link to="/EaseMind_personal_details">
          <button type="button" className="easeMindButton">Create My Details</button>
        </Link>
        <Link to="/anxiety-level-test">
          <button type="button" className="easeMindButton">Anxiety Level Test</button>
        </Link>

        {/* FIXME: no prod console log and no unused function parameters */}
        {/* <button type="button" className="easeMindButton" onClick={() => handleButtonClick('Chat with Us')}>Chat with Us</button> */}
      </div>
    </div>
  );
}

export default EaseMind;
