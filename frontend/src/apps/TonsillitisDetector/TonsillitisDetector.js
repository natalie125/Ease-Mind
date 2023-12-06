import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import WebcamCapture from '../../components/Camera/Camera';

// commented code below webcam capture is an example of how to send to '/shreyas' endpoint instead of '/upload' endpoint
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
            <WebcamCapture context="shreyas" />
            {/* <WebcamCapture context="shreyas"/> */}
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
