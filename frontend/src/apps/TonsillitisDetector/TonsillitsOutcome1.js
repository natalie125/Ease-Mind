import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// commented code below webcam capture is an example of how to send to '/shreyas' endpoint instead of '/upload' endpoint
class TonsillitisOutcome1 extends Component {
  render() {
    return (
      <div className="App">
        <div className="tons-page-container">
          <h1 className="tons-page-header">Outcome of your results</h1>
          <div>
            <h2 className="tons-page-subheader"> You aren't showing any signs of throat infection!</h2>
            <p className="bullet-point">Enjoy the rest of your day :)</p>
            <Link to="/home">
              <button className="tons-page-button"> Go back to home </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default TonsillitisOutcome1;
