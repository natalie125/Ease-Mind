import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EaseMind.css';

function TestPage() {
  const navigate = useNavigate();
  return (
    <div className="easeMindContainer">
      <button
        type="button"
        className="GoBackButton"
        onClick={() => navigate('/EaseMind')} // Navigate to EaseMind page
      >
        Go Back
      </button>
      <h1 className="easeMindTitle">
        Tests for anxiety
      </h1>
      <div>
        <Link to="/EaseMind_anxiety-level-test">
          <button type="button" className="easeMindButton">Anxiety Level Test</button>
        </Link>
        <Link to="/EaseMind_spin">
          <button type="button" className="easeMindButton">The Social Phobia Inventory</button>
        </Link>
        <Link to="/EaseMind_pd">
          <button type="button" className="easeMindButton">Panic Disorder Test</button>
        </Link>
        <Link to="/EaseMind_ptsd">
          <button type="button" className="easeMindButton">PTSD Test</button>
        </Link>
      </div>
    </div>
  );
}

export default TestPage;
