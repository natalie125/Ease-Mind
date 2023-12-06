import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import exampleImg from './images/example.jpg';

// commented code below webcam capture is an example of how to send to '/shreyas' endpoint instead of '/upload' endpoint
class TonsPhotoInstructions extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="tons-page-header">Instructions for using the tonsillitis detector</h1>
        <div
          className="tons-page-container bullet-point"
          style={{ color: '#a40000' }}
        >
          Disclaimer: This diagnostic tool has been found to have 88% accuracy in testing. Please
          consult a Local Health Facility upon completion as results may be inaccurate.
        </div>

        <div className="tons-page-container">
          <div>
            <ol className="bullet-point-container" type="1">
              <li className="bullet-point">Make sure you're in a dim lit room</li>
              <li className="bullet-point">Switch to the front camera on your phone</li>
              <li className="bullet-point">
                Open your mouth as wide as possible and try to keep the tongue down
              </li>
              <li className="bullet-point">
                Place the phone front camera facing the inside of your mouth and take a picture with
                flash
              </li>
            </ol>
          </div>
          <p className="bullet-point">
            In order for the model to correctly analyse your mouth sample, the tonsils must be
            clearly visible
          </p>
          <p className="bullet-point">
            Example picture of what should be produced can be seen below
          </p>
          <div className="image-container">
            <img src={exampleImg} alt="Example picture" />
          </div>
          <Link to="/shreyas/shreyas">
            <button className="tons-page-button"> Continue </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default TonsPhotoInstructions;
