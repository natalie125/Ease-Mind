import React from 'react';
import { Link } from 'react-router-dom';
import pageNotFoundImage from './pageNotFound.png';
import './PageNotFound.scss';

function PageNotFound() {
  return (
    <div className="page-not-found">
      <img src={pageNotFoundImage} alt="404" />
      <h2>Page Not Found</h2>
      <Link to="/home">Click here to go home!</Link>
    </div>
  );
}

export default PageNotFound;
