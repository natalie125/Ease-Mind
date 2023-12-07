import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Webcam from '../../components/Camera/Camera';

class TonsillitisDetector extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="tons-page-header">Shreyas' app</h1>
        <div className="tons-page-camera-container">
          <div className="webcam-capture-holder">
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
              Webcam capture below (to use flash please brighten your screen)
            </p>
            <Webcam context="shreyas" />
          </div>
          <Link to="/home">
            <button className="tons-page-button"> Back </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default TonsillitisDetector;
