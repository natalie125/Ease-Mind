import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// commented code below webcam capture is an example of how to send to '/shreyas' endpoint instead of '/upload' endpoint
class TonsillitisOutcome2 extends Component {
  render() {
    return (
      <div className="App">
        <div className="tons-page-container">
          <h1 className="tons-page-header">Outcome of your results</h1>
          <div>
            <h2 className="tons-page-subheader">
              {' '}
              You may have tonsillitis or are showing early signs of tonsillitis!
            </h2>
            <h3>Please observe the following questions:</h3>
            <ol className="bullet-point-container">
              <li>Is there swelling on your tonsils with yellow spots?</li>
              <li>
                On the sides of the back of your neck(one or both sides), do you have a swollen lump
                and is it tender
              </li>
              <li>Do you have a temperature more than 38%</li>
              <li>Is there an ABSCENCE of a cough</li>
              <li>Are you under the age of 15?</li>
              <h4 style={{ color: '#a40000' }}>
                If you have answered YES to 3 or more of the above questions, there is a high
                probability you have contracted Bacterial Tonsillitis. Please contact your GP
                immediately.
              </h4>
            </ol>

            <h3>Here is some general advice from the NHS:</h3>
            <p>Tonsillitis usually gets better on its own after a few days.</p>
            <p>To help treat the symptoms:</p>
            <ul className="bullet-point-container">
              <li>get plenty of rest</li>
              <li>drink cool drinks to soothe the throat</li>
              <li>take paracetamol or ibuprofen (do not give aspirin to children under 16)</li>
              <li>gargle with warm salty water (children should not try this)</li>
            </ul>
            <Link to="/home">
              <button className="tons-page-button"> Go back to home </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default TonsillitisOutcome2;
