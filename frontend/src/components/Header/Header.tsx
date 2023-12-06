import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthTokenContext } from '../../App';
import './Header.scss';

function Header() {
  const { token, setToken } = useContext(AuthTokenContext);

  if (!token) return null;

  return (
    <header className="header">
      <Link to="/home" className="title-link">
        <h1 className="title">LARKS APP</h1>
      </Link>
      <div className="header-buttons">
        <div className="dropdown">
          <button className="dropdown-button" type="button">
            Apps
            <div className="dropdown-content">
              <Link to="/canopy">Canopy</Link>
              <Link to="/skin-scan">Skin Scan</Link>
              <Link to="/dipstik">Dipstik</Link>
              <Link to="/paralysis-analysis">Paralysis Analysis</Link>
              <Link to="/shreyas/tonsillitis_instructions">Tonsillitis Detector</Link>
              <Link to="/roots-radar">Roots Radar App</Link>
              <Link to="/EaseMind">EaseMind</Link>
              <Link to="/autism_instructions">Autism Detector</Link>
              <Link to="/food_allergy_chatbot">Food Allergy Chatbot</Link>
            </div>
          </button>
        </div>
        <button data-cy="logoutBtn" onClick={() => setToken(null)} type="button">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
