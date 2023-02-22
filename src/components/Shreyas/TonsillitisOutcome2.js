import React, { Component } from "react";
import { Link } from "react-router-dom";

import Header from "../Header/Header";

import "../App/App.css";

//commented code below webcam capture is an example of how to send to '/shreyas' endpoint instead of '/upload' endpoint
class TonsillitisOutcome2 extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <h1>Outcome of your results</h1>
                <div>
                    <h2> You may have tonsillitis or are showing early signs of tonsillitis!</h2>
                    <h3>Here is some general advice from the NHS:</h3>
                    <p>Tonsillitis usually gets better on its own after a few days.</p>
                    <p>To help treat the symptoms:</p>
                    <ul>
                        <li>get plenty of rest</li>
                        <li>drink cool drinks to soothe the throat</li>
                        <li>take paracetamol or ibuprofen (do not give aspirin to children under 16)</li>
                        <li>gargle with warm salty water (children should not try this)</li>
                    </ul>
                    <p>See a GP if:</p>
                    <ul>
                        <li>you have pus-filled spots on your tonsils</li>
                        <li>the sore throat is so painful it's difficult to eat or drink</li>
                        <li>the symptoms do not go away within 4 days</li>
                    </ul>
                    <Link to="/home">
                        <button> Go back to home </button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default TonsillitisOutcome2;