import React from 'react';
import { Link } from 'react-router-dom';
import './EaseMind.css';
const EaseMind = () => {

  const handleButtonClick = (buttonName) => {
    console.log(`Button clicked: ${buttonName}`);

  };

  return (
    <div className="easeMindContainer">
      <h1 className="easeMindTitle">Welcome!</h1>

      <div>
        <Link to="/EaseMind_personal_details">
          <button className="easeMindButton">Create My Details</button>
        </Link>
        <Link to="/anxiety-level-test">
          <button className="easeMindButton">Anxiety Level Test</button>
        </Link>

        <button className="easeMindButton" onClick={() => handleButtonClick('Chat with Us')}>Chat with Us</button>
      </div>
    </div>
  );
}

export default EaseMind;